import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function formatPhone(phone: string) {
  let formattedPhone = phone.replace(/[^\d]/g, '')

  if (formattedPhone.startsWith('0')) {
    formattedPhone = `254${formattedPhone.slice(1)}`
  } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
    formattedPhone = `254${formattedPhone}`
  }

  return formattedPhone
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, phone, amount } = await request.json()

    if (!orderId || !phone || !amount) {
      return jsonResponse({ error: 'orderId, phone, and amount are required.' }, 400)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')
    const shortCode = Deno.env.get('MPESA_SHORTCODE')
    const passkey = Deno.env.get('MPESA_PASSKEY')

    if (!supabaseUrl || !serviceRoleKey || !consumerKey || !consumerSecret || !shortCode || !passkey) {
      return jsonResponse({ error: 'Missing required Supabase or M-Pesa function secrets.' }, 500)
    }

    const accessTokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${btoa(`${consumerKey}:${consumerSecret}`)}`,
        },
      },
    )

    const accessTokenPayload = await accessTokenResponse.json()
    if (!accessTokenResponse.ok) {
      return jsonResponse({ error: accessTokenPayload }, 500)
    }

    const now = new Date()
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
    const password = btoa(`${shortCode}${passkey}${timestamp}`)
    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`
    const formattedPhone = formatPhone(phone)

    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessTokenPayload.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: 'SwiftStore',
        TransactionDesc: 'Payment for order',
      }),
    })

    const stkPayload = await stkResponse.json()
    if (!stkResponse.ok) {
      return jsonResponse({ error: stkPayload }, 500)
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        checkout_request_id: stkPayload.CheckoutRequestID,
        payment_method: 'M-Pesa',
      })
      .eq('id', orderId)

    if (error) {
      return jsonResponse({ error: error.message }, 500)
    }

    return jsonResponse(stkPayload)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse({ error: message }, 500)
  }
})

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

function extractReceipt(metadata: Array<{ Name: string; Value: string | number }>) {
  return metadata.find((item) => item.Name === 'MpesaReceiptNumber')?.Value ?? null
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await request.json()
    const callbackData = payload?.Body?.stkCallback

    if (!callbackData) {
      return jsonResponse({ error: 'Invalid callback payload.' }, 400)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: 'Missing Supabase service role credentials.' }, 500)
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    const resultCode = callbackData.ResultCode
    const metadata = callbackData.CallbackMetadata?.Item ?? []
    const paymentReference = extractReceipt(metadata)

    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        status: resultCode === 0 ? 'paid' : 'cancelled',
        payment_reference: paymentReference,
      })
      .eq('checkout_request_id', callbackData.CheckoutRequestID)

    if (error) {
      return jsonResponse({ error: error.message }, 500)
    }

    return jsonResponse({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse({ error: message }, 500)
  }
})

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, phone, submissionId, birthDetails, serviceTitle, servicePrice, utrNumber } = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const utrText = utrNumber ? `\n🔢 <b>UPI Ref / UTR:</b> <code>${utrNumber}</code>` : '';
    const planText = serviceTitle ? `\n💰 <b>સેવા (Plan):</b> ${serviceTitle} (₹${servicePrice})` : '';

    const messageText = `🔔 <b>નવી કુંડળી વિનંતી (New Request)</b>\n\n` +
      `👤 <b>નામ (Name):</b> ${name}\n` +
      `📞 <b>મોબાઇલ (Phone):</b> ${phone}${planText}${utrText}\n\n` +
      `📅 <b>જન્મ તારીખ (DOB):</b> ${birthDetails.date}\n` +
      `⏰ <b>જન્મ સમય (TOB):</b> ${birthDetails.time}\n` +
      `📍 <b>જન્મ સ્થળ (POB):</b> ${birthDetails.place.split(',')[0]}\n\n` +
      `💳 <b>ચુકવણી ચકાસો (Verify Payment):</b> "AstroSeva - ${name}"\n` +
      `🔗 <b>કુંડળી ખોલો (View Dashboard):</b> ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin`;

    console.log('--- NEW NOTIFICATION ---');
    console.log(messageText);
    console.log('------------------------');

    // 1. Send via Telegram Bot if configured
    if (botToken && chatId) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
            parse_mode: 'HTML',
          }),
        });

        if (!response.ok) {
          console.error('Telegram notification error status:', response.statusText);
        } else {
          console.log('Telegram notification sent successfully.');
        }
      } catch (err) {
        console.error('Failed to send Telegram notification:', err);
      }
    }

    // 2. Send via Email (Resend) if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const guruEmail = process.env.GURU_EMAIL;
    if (resendApiKey && guruEmail) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Astro-Seva <notifications@astro-seva.dev>',
            to: guruEmail,
            subject: `નવી કુંડળી વિનંતી: ${name}`,
            html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
              <h2 style="color: #FF9933;">નવી કુંડળી વિનંતી</h2>
              <p><b>નામ:</b> ${name}</p>
              <p><b>મોબાઇલ:</b> ${phone}</p>
              <p><b>જન્મ તારીખ:</b> ${birthDetails.date}</p>
              <p><b>જન્મ સમય:</b> ${birthDetails.time}</p>
              <p><b>જન્મ સ્થળ:</b> ${birthDetails.place}</p>
              <br/>
              <p>ગુરુજી, કૃપા કરીને બેંક ખાતામાં <b>AstroSeva - ${name}</b> માટે ચુકવણી તપાસો.</p>
            </div>`,
          }),
        });

        if (emailResponse.ok) {
          console.log('Resend email sent successfully.');
        }
      } catch (err) {
        console.error('Failed to send Resend email:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Notification API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

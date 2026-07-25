export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const payload = {
    username: 'LGO Corp お問い合わせ',
    embeds: [{
      title: '新しいお問い合わせ',
      color: 15242074,
      fields: [
        { name: 'お名前',           value: name,                inline: true  },
        { name: '会社名・屋号',     value: company || '未記入', inline: true  },
        { name: 'メールアドレス',   value: email,               inline: false },
        { name: 'お問い合わせ内容', value: message,             inline: false },
      ],
      timestamp: new Date().toISOString()
    }]
  };

  const webhookRes = await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (webhookRes.ok) {
    return res.status(200).json({ ok: true });
  } else {
    return res.status(500).json({ error: 'Failed to send' });
  }
}

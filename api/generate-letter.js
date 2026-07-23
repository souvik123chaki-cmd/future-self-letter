export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, age, worry, dream } = req.body || {};

  if (!name || !age || !worry || !dream) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const futureAge = parseInt(age) + 30;

  const systemPrompt = `You are ${name}, but thirty years older — writing a letter back to your younger self at age ${age}. You are now ${isNaN(futureAge) ? "much older" : futureAge}. You know exactly how things unfolded because you lived them, but you never state facts that weren't given to you — you write with warmth, specificity, and emotional honesty, referencing the exact worry and dream your younger self shared, without being preachy, generic, or overly poetic. Avoid cliches like "time heals" or "everything happens for a reason." Write 220-320 words. Do not use markdown formatting, headers, or asterisks. End with a short, warm sign-off line using the name "${name}" naturally, on its own final line, starting with something like "Still you," or "With everything,"`;

  const userPrompt = `Here is what my younger self (age ${age}) shared:\n\nWhat's weighing on me: ${worry}\n\nWhat I'm quietly dreaming of: ${dream}\n\nWrite the letter now.`;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 600,
        temperature: 0.9
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error('Groq error:', data);
      return res.status(502).json({ error: 'The AI provider had an issue. Try again shortly.' });
    }

    const letter = data.choices?.[0]?.message?.content?.trim() || '';

    if (!letter) {
      return res.status(502).json({ error: 'Got an empty letter back. Try again.' });
    }

    return res.status(200).json({ letter });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong generating the letter.' });
  }
}

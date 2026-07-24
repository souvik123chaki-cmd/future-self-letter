// This file runs on Vercel's servers, never in the user's browser —
// so your GROQ_API_KEY stays hidden. Set it as an Environment Variable
// in your Vercel project settings (instructions in README.md).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, age, stressType, ventText, dream } = req.body || {};

  if (!name || !age || !stressType || !dream) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Basic safety check — if vent text signals a crisis, don't generate a
  // playful AI letter. Point them to real help instead.
  const crisisPatterns = /\b(suicide|kill myself|end my life|want to die|self.?harm|hurt myself)\b/i;
  if (ventText && crisisPatterns.test(ventText)) {
    return res.status(200).json({
      crisis: true,
      letter: "It sounds like you're going through something really heavy right now. This isn't something an AI letter can help with the way you deserve — please reach out to someone who can. If you're in India, you can call the KIRAN mental health helpline at 1800-599-0019, free and available 24/7. If you're elsewhere, please look up your local crisis line. You matter, and this is worth talking to a real person about."
    });
  }

  const futureAge = parseInt(age) + 30;

  const stressLine = ventText && ventText.trim()
    ? `The main thing weighing on them right now is around ${stressType}, and in their own words: "${ventText.trim()}"`
    : `The main thing weighing on them right now is around ${stressType}.`;

  const systemPrompt = `You are ${name}, but thirty years older — writing a letter back to your younger self at age ${age}. You are now ${isNaN(futureAge) ? "much older" : futureAge}. You know exactly how things unfolded because you lived them, but you never state facts that weren't given to you — you write with warmth, specificity, and emotional honesty, referencing what your younger self is going through and dreaming of, without being preachy, generic, or overly poetic. Avoid cliches like "time heals" or "everything happens for a reason." If they shared their own words about what's bothering them, let the letter clearly show you actually heard that, in their own terms, not a generic summary. Write 220-320 words. Do not use markdown formatting, headers, or asterisks. End with a short, warm sign-off line using the name "${name}" naturally, on its own final line, starting with something like "Still you," or "With everything,"`;

  const userPrompt = `Here is what my younger self (age ${age}) shared:\n\n${stressLine}\n\nWhat I'm quietly dreaming of: ${dream}\n\nWrite the letter now.`;

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

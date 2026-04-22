export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { name, phone, purpose, date, time } = body;

    if (!name || !phone || !purpose || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if slot is already booked
    const existing = await env.DB.prepare(
      "SELECT id FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND status != 'cancelled'"
    )
      .bind(date, time)
      .first();

    if (existing) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Αυτή η ώρα είναι ήδη κλεισμένη. Παρακαλούμε επιλέξτε άλλη." 
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert into D1 database
    await env.DB.prepare(
      "INSERT INTO appointments (fullname, phone, purpose, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(name, phone, purpose, date, time, 'pending')
      .run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Το ραντεβού σας καταχωρήθηκε με επιτυχία!" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

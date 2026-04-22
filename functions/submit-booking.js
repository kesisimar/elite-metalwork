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

    // Insert into D1 database
    // Table columns: id, fullname, phone, purpose, appointment_date, appointment_time, status, created_at
    // We bind fullname, phone, purpose, appointment_date, appointment_time, and status (default 'pending')
    await env.DB.prepare(
      "INSERT INTO appointments (fullname, phone, purpose, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(name, phone, purpose, date, time, 'pending')
      .run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Appointment submitted successfully" 
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

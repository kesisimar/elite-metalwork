export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return new Response(JSON.stringify({ error: "Date parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { results } = await env.DB.prepare(
      "SELECT appointment_time FROM appointments WHERE appointment_date = ? AND status != 'cancelled'"
    )
      .bind(date)
      .all();

    const bookedTimes = results.map(row => row.appointment_time);

    return new Response(JSON.stringify({ bookedTimes }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

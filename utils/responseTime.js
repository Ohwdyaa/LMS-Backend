// middleware/responseTime.js
module.exports = (req, res, next) => {
  const start = process.hrtime.bigint(); // Mulai timer

  res.on('finish', () => {
    const end = process.hrtime.bigint(); // Hentikan timer
    const duration = Number(end - start) / 1_000_000_000; // Konversi nanodetik ke detik
    console.log(`[${req.method}] ${req.originalUrl} - Waktu Eksekusi: ${duration.toFixed(4)} detik`);
    // Anda bisa menyimpan duration ini ke database, log file, atau metrik
  });

  next();
};
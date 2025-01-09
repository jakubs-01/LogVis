exports.getHealth = (req, res) => {
  // Check for both IPv4 and IPv6 localhost formats
  if (
    req.ip !== "127.0.0.1" &&
    req.ip !== "::ffff:127.0.0.1" &&
    req.ip !== "::1"
  ) {
    res.status(403).json({ message: "Forbidden" });
  } else {
    res.json({ message: "OK" });
  }
};

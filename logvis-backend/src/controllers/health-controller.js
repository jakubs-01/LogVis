exports.getHealth = (req, res) => {
  if (req.ip !== "127.0.0.1") {
    res.status(403).json({ message: "Forbidden" });
  } else {
    res.json({ message: "OK" });
  }
};

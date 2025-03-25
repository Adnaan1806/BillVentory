import express from 'express';
import { authenticator } from 'otplib'; // Import authenticator directly
import qrcode from 'qrcode'; // Correct import for qrcode

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const generateSecret = () => authenticator.generateSecret();

const generateOTP = (secret) => authenticator.generate(secret);

const verifyOTP = (secret, token) => authenticator.verify({ secret, token });

const generateQRCode = async (secret) => {
  const otpauth = authenticator.keyuri("user@example.com", "MyApp", secret);

  try {
    const qrImage = await qrcode.toDataURL(otpauth);
    return qrImage;
  } catch (error) {
    console.error("Error in generating QR Code: ", error);
    return null;
  }
};

app.get("/", async (req, res) => {
  const secret = generateSecret();
  const qrCode = await generateQRCode(secret);
  res.render("index", { secret, qrCode });
});

app.post("/verify", (req, res) => {
  const { secret, token } = req.body;
  const isValid = verifyOTP(secret, token);
  res.render("verify", { isValid });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);

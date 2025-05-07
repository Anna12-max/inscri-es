const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// Multer para processar o envio do vídeo
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/enviar-inscricao", upload.single("video"), async (req, res) => {
  const { nome, idade, escolaridade, cidade, bairro, whatsapp, email } = req.body;
  const video = req.file;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "annabarbarasilva45@gmail.com", // ⬅️ SUBSTITUA pelo seu Gmail
      pass: "uzdqvqipulkllqfw"         // ⬅️ SENHA de aplicativo gerada pelo Google
    }
  });

  const mailOptions = {
    from: email,
    to: "annabarbarasilva45@gmail.com",
    subject: "Nova Inscrição Recebida",
    text: `Nome: ${nome}
Idade: ${idade}
Escolaridade: ${escolaridade}
Cidade: ${cidade}
Bairro: ${bairro}
WhatsApp: ${whatsapp}
Email: ${email}`,
    attachments: video
      ? [
          {
            filename: video.originalname,
            content: video.buffer
          }
        ]
      : []
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Inscrição enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ error: "Erro ao enviar inscrição." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
//http://localhost:3000
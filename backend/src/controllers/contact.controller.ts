import type { Request, Response } from "express";
import { db } from "../db/pool.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createContactMessage(
  request: Request,
  response: Response,
): Promise<void> {
  const { name, email, subject, message } = request.body ?? {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    response.status(400).json({
      error: "Name, email, subject, and message are required",
    });
    return;
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
    response.status(400).json({
      error: "Name, email, subject, and message are required",
    });
    return;
  }

  if (!emailRegex.test(cleanEmail)) {
    response.status(400).json({
      error: "Please provide a valid email address",
    });
    return;
  }

  if (
    cleanName.length > 255 ||
    cleanEmail.length > 255 ||
    cleanSubject.length > 255
  ) {
    response.status(400).json({
      error: "Name, email, or subject is too long",
    });
    return;
  }

  if (cleanMessage.length > 10000) {
    response.status(400).json({
      error: "Message is too long",
    });
    return;
  }

  if (!request.authUser) {
    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  const result = await db.query(
    `INSERT INTO contact_messages
      (user_id, name, email, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, name, email, subject, message, created_at`,
    [
      request.authUser.id,
      cleanName,
      cleanEmail,
      cleanSubject,
      cleanMessage,
    ],
  );

  response.status(201).json({
    message: "Your message has been received",
    contact_message: result.rows[0],
  });
}

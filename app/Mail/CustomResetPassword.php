<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
// use Illuminate\Mail\Mailables\Address;

class CustomResetPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $token; // Properti untuk menyimpan token reset password
    public $user; // Properti untuk menyimpan data user (opsional, tapi berguna)

    /**
     * Create a new message instance.
     */
    public function __construct($token, $user)
    {
        $this->token = $token;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            // to: new Address($this->user->email, $this->user->name),
              to: $this->user->email,
            subject: 'Reset Password UKM-POLICY', // Subjek email dengan branding
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // URL reset password akan digenerate di template Blade
        return new Content(
            markdown: 'emails.auth.reset-password', // Menggunakan template Blade kustom Anda
            with: [
                'token' => $this->token,
                'user' => $this->user,
                'app_name' => 'UKM-POLICY', // Teruskan nama aplikasi kustom
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

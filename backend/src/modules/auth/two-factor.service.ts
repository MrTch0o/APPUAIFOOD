import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorService {
  /**
   * Gera um secret para 2FA e retorna o secret e a URL otpauth
   */
  generateSecret(userEmail: string) {
    const secret = speakeasy.generateSecret({
      name: `UAIFOOD (${userEmail})`,
      issuer: 'UAIFOOD',
      length: 32,
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    };
  }

  /**
   * Gera um QR code a partir da URL otpauth
   */
  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      // Gera QR code como Data URL (base64)
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      return qrCodeDataUrl;
    } catch {
      throw new Error('Erro ao gerar QR code');
    }
  }

  /**
   * Verifica se um token TOTP é válido
   */
  verifyToken(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Aceita tokens de até 2 períodos antes/depois (60s cada)
    });
  }

  /**
   * Gera um token TOTP (útil para testes)
   */
  generateToken(secret: string): string {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
    });
  }
}

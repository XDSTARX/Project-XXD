export type PixBank =
  | "PicPay"
  | "Nubank"
  | "Recargapay"
  | "PagBank"
  | "InfinitePay"
  | "Itaú"
  | "Bradesco"
  | "Banco do Brasil"
  | "Caixa"
  | "Santander"
  | "Inter"
  | "C6"
  | "Sicoob"
  | "Sicredi";

export interface PixWithdrawalRequest {
  amountCents: number;
  bank: PixBank | string;
  pixKey: string; // phone/email/cpf/chave aleatória
}

export interface PixWithdrawalResponse {
  providerName: string;
  providerRef: string;
  estimatedSeconds: number;
}

export interface PixProvider {
  name: string;
  payout(req: PixWithdrawalRequest): Promise<PixWithdrawalResponse>;
}

export class MockPixProvider implements PixProvider {
  name = "mock";
  async payout(req: PixWithdrawalRequest): Promise<PixWithdrawalResponse> {
    // Simula sucesso rápido
    const ref = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      providerName: this.name,
      providerRef: ref,
      estimatedSeconds: 30,
    };
  }
}

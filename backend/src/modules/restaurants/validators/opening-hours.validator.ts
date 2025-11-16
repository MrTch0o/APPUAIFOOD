import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validador customizado para horário de funcionamento
 * Formatos aceitos:
 * - Record<string, string> com dias (seg, ter, qua, qui, sex, sab, dom) e horários no formato HH:MM-HH:MM
 * - Exemplos válidos: "11:00-23:00", "09:30-22:15"
 */
@ValidatorConstraint({ name: 'isValidOpeningHours', async: false })
export class IsValidOpeningHoursConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any): boolean {
    // Se for undefined/null, é válido (campo opcional)
    if (value === undefined || value === null) {
      return true;
    }

    // Se for string, valida o formato direto
    if (typeof value === 'string') {
      return this.validateTimeFormat(value);
    }

    // Se for objeto, valida cada dia
    if (typeof value === 'object' && !Array.isArray(value)) {
      const validDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
      const valueObj = value as Record<string, unknown>;

      for (const [day, hours] of Object.entries(valueObj)) {
        // Verifica se o dia é válido
        if (!validDays.includes(day)) {
          return false;
        }

        // Se tem valor, deve ser string com formato válido
        if (typeof hours !== 'string') {
          return false;
        }

        // Valida o formato da hora
        if (hours && !this.validateTimeFormat(hours)) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Valida se o formato da hora está correto: HH:MM-HH:MM
   */
  private validateTimeFormat(time: string): boolean {
    // Permite string vazia ou campo não preenchido
    if (!time || time.trim() === '') {
      return true;
    }

    // Regex para validar HH:MM-HH:MM (24 horas)
    const timeRegex =
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(time)) {
      return false;
    }

    // Valida se hora de início é menor que hora de fim
    const [start, end] = time.split('-');
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return startMinutes < endMinutes;
  }

  defaultMessage(): string {
    return `O formato do horário de funcionamento é inválido. Use HH:MM-HH:MM (ex: 11:00-23:00). Para múltiplos dias, envie um objeto JSON com chaves seg, ter, qua, qui, sex, sab, dom`;
  }
}

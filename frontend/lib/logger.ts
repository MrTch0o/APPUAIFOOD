/**
 * Logger utility para frontend
 * Fornece métodos estruturados para logging com timestamps e níveis
 */

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const isDevelopment = process.env.NODE_ENV === "development";

const formatTimestamp = (): string => {
  return new Date().toISOString();
};

const getStylesForLevel = (level: LogLevel): string => {
  const styles = {
    [LogLevel.DEBUG]: "color: #888; font-weight: bold;",
    [LogLevel.INFO]: "color: #0066cc; font-weight: bold;",
    [LogLevel.WARN]: "color: #ff9900; font-weight: bold;",
    [LogLevel.ERROR]: "color: #cc0000; font-weight: bold;",
  };
  return styles[level];
};

const log = (level: LogLevel, message: string, data?: unknown): void => {
  const timestamp = formatTimestamp();
  void { timestamp, level, message, data };

  if (isDevelopment) {
    const prefix = `%c[${timestamp}] [${level}]`;
    const styles = getStylesForLevel(level);

    if (data !== undefined) {
      console.log(prefix, styles, message, data);
    } else {
      console.log(prefix, styles, message);
    }
  }

  // Aqui você pode adicionar envio para um serviço de logging remoto
  // saveLogToServer(logEntry);
};

export const logger = {
  debug: (message: string, data?: unknown) =>
    log(LogLevel.DEBUG, message, data),
  info: (message: string, data?: unknown) => log(LogLevel.INFO, message, data),
  warn: (message: string, data?: unknown) => log(LogLevel.WARN, message, data),
  error: (message: string, data?: unknown) =>
    log(LogLevel.ERROR, message, data),
};

"use client";

import React, { useCallback, useMemo } from "react";

interface OpeningHoursInputProps {
  value?: Record<string, string> | null;
  onChange: (value: Record<string, string>) => void;
}

const DAYS = [
  { id: "seg", label: "Segunda-feira" },
  { id: "ter", label: "Terça-feira" },
  { id: "qua", label: "Quarta-feira" },
  { id: "qui", label: "Quinta-feira" },
  { id: "sex", label: "Sexta-feira" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
];

export function OpeningHoursInput({ value, onChange }: OpeningHoursInputProps) {
  const hoursData = useMemo(() => {
    return value && typeof value === "object"
      ? (value as Record<string, string>)
      : {
          seg: "",
          ter: "",
          qua: "",
          qui: "",
          sex: "",
          sab: "",
          dom: "",
        };
  }, [value]);

  const handleDayChange = useCallback(
    (day: string, newValue: string) => {
      const updated = { ...hoursData, [day]: newValue };
      onChange(updated);
    },
    [hoursData, onChange]
  );

  const handleSetAll = useCallback(
    (time: string) => {
      const updated = DAYS.reduce((acc, day) => {
        acc[day.id] = time;
        return acc;
      }, {} as Record<string, string>);
      onChange(updated);
    },
    [onChange]
  );

  return (
    <div className="bg-white rounded-lg border border-[#e7d9cf] p-6">
      <h3 className="text-lg font-bold text-[#1b130d] mb-4">
        Horário de Funcionamento
      </h3>

      {/* Quick Actions */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => handleSetAll("11:00-23:00")}
          className="px-3 py-2 bg-[#f3ece7] text-[#1b130d] text-sm rounded-lg hover:bg-[#e7d9cf] transition-colors"
        >
          11h-23h (Padrão)
        </button>
        <button
          type="button"
          onClick={() => handleSetAll("10:00-22:00")}
          className="px-3 py-2 bg-[#f3ece7] text-[#1b130d] text-sm rounded-lg hover:bg-[#e7d9cf] transition-colors"
        >
          10h-22h
        </button>
        <button
          type="button"
          onClick={() => handleSetAll("")}
          className="px-3 py-2 bg-[#f3ece7] text-[#1b130d] text-sm rounded-lg hover:bg-[#e7d9cf] transition-colors"
        >
          Limpar Tudo
        </button>
      </div>

      {/* Day inputs */}
      <div className="space-y-3">
        {DAYS.map((day) => (
          <div key={day.id} className="flex items-center gap-4">
            <label className="w-32 text-[#1b130d] font-medium text-sm">
              {day.label}
            </label>
            <input
              type="text"
              value={hoursData[day.id] || ""}
              onChange={(e) => handleDayChange(day.id, e.target.value)}
              placeholder="Ex: 11:00-23:00"
              className="flex-1 px-4 py-2 rounded-lg border border-[#e7d9cf] bg-[#f3ece7] text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
            />
          </div>
        ))}
      </div>

      <p className="text-[#9a6c4c] text-xs mt-4">
        Deixe em branco para dia fechado. Use o formato HH:MM-HH:MM (ex:
        11:00-23:00)
      </p>
    </div>
  );
}

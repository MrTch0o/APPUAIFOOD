"use client";

import React, { useCallback, useMemo, useState } from "react";

interface OpeningHoursInputProps {
  value?: Record<string, string | string[]> | null;
  onChange: (value: Record<string, string | string[]>) => void;
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
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const hoursData = useMemo(() => {
    const data: Record<string, string | string[]> = {};

    if (value && typeof value === "object") {
      for (const day of DAYS) {
        const dayValue = (value as Record<string, string | string[]>)[day.id];
        if (dayValue) {
          data[day.id] = dayValue;
        } else {
          data[day.id] = "";
        }
      }
    } else {
      DAYS.forEach((day) => {
        data[day.id] = "";
      });
    }

    return data;
  }, [value]);

  const normalizeToArray = (value: string | string[]): string[] => {
    if (Array.isArray(value)) {
      return value;
    }
    return value ? [value] : [];
  };

  const handleAddSlot = useCallback(
    (day: string) => {
      const current = normalizeToArray(hoursData[day] as string | string[]);
      const updated = [...current, ""];
      const newHours = { ...hoursData, [day]: updated };
      onChange(newHours);
    },
    [hoursData, onChange]
  );

  const handleRemoveSlot = useCallback(
    (day: string, index: number) => {
      const current = normalizeToArray(hoursData[day] as string | string[]);
      const updated = current.filter((_, i) => i !== index);
      const newHours = {
        ...hoursData,
        [day]:
          updated.length === 0
            ? ""
            : updated.length === 1
            ? updated[0]
            : updated,
      };
      onChange(newHours);
    },
    [hoursData, onChange]
  );

  const handleSlotChange = useCallback(
    (day: string, index: number, newValue: string) => {
      const current = normalizeToArray(hoursData[day] as string | string[]);
      const updated = [...current];
      updated[index] = newValue;
      const newHours = {
        ...hoursData,
        [day]: updated.length === 1 ? updated[0] : updated,
      };
      onChange(newHours);
    },
    [hoursData, onChange]
  );

  const handleSetAll = useCallback(
    (time: string) => {
      const updated = DAYS.reduce((acc, day) => {
        acc[day.id] = time;
        return acc;
      }, {} as Record<string, string | string[]>);
      onChange(updated);
    },
    [onChange]
  );

  const toggleExpanded = (day: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

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
        {DAYS.map((day) => {
          const dayValue = hoursData[day.id];
          const slots = normalizeToArray(dayValue as string | string[]);
          const hasMultipleSlots =
            Array.isArray(dayValue) && dayValue.length > 1;

          return (
            <div
              key={day.id}
              className="border border-[#e7d9cf] rounded-lg p-4 bg-[#f8f7f6]"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#1b130d] font-medium text-sm">
                  {day.label}
                </label>
                {hasMultipleSlots && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(day.id)}
                    className="text-[#ee7c2b] text-xs hover:underline"
                  >
                    {expandedDays.has(day.id) ? "Recolher" : "Expandir"}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {slots.length === 0 ? (
                  <div>
                    <input
                      type="text"
                      value=""
                      onChange={(e) =>
                        handleSlotChange(day.id, 0, e.target.value)
                      }
                      placeholder="Ex: 11:00-23:00"
                      className="w-full px-4 py-2 rounded-lg border border-[#e7d9cf] bg-white text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                    />
                  </div>
                ) : (
                  slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={slot}
                        onChange={(e) =>
                          handleSlotChange(day.id, index, e.target.value)
                        }
                        placeholder="Ex: 11:00-23:00"
                        className="flex-1 px-4 py-2 rounded-lg border border-[#e7d9cf] bg-white text-[#1b130d] placeholder-[#9a6c4c] focus:outline-0 focus:ring-2 focus:ring-[#ee7c2b]/50"
                      />
                      {slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(day.id, index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => handleAddSlot(day.id)}
                className="mt-2 text-[#ee7c2b] text-sm hover:underline font-medium"
              >
                + Adicionar período
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[#9a6c4c] text-xs mt-4">
        Deixe em branco para dia fechado. Use o formato HH:MM-HH:MM (ex:
        11:00-23:00). Você pode adicionar múltiplos períodos por dia para
        representar intervalos de funcionamento (ex: 11:00-14:00 e 18:00-23:00)
      </p>
    </div>
  );
}

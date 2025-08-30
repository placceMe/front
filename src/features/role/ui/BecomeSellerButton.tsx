/*import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setActiveRole, setUser } from "../../../entities/user/model/userSlice";
import { useRequest } from "@shared/request/useRequest";
//TODO Fix local to  global role
export const BecomeSellerButton = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { request: baseRequest } = useRequest();

  const handleBecomeSeller = async () => {
    if (!user) return;

    let success = false;

    try {
      await baseRequest(`/api/users/make-saler`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      success = true;
    } catch {
      success = false;
    }

    if (success) {
      const updatedUser = {
        ...user,
        roles: [...new Set([...user.roles, "Saler"])],
      };
      dispatch(setUser(updatedUser));
      dispatch(setActiveRole("Saler"));
      window.location.hash = "#home";
    } else {
      alert("Не вдалося стати спорядником");
    }
  };

  return (
    <button
      className="bg-[#454E30] hover:bg-[#5a6b3b] text-white font-semibold py-2 px-4 rounded"
      onClick={handleBecomeSeller}
    >
      Стати спорядником
    </button>
  );
};
*/








interface Contact {
  type: string;
  value: string;
}

interface SalerInfo {
  companyName: string;
  description: string;
  schedule: string;
  contacts: Contact[];
}

interface BecomeSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (salerInfo: SalerInfo) => void;
  isLoading: boolean;
}

export const BecomeSellerModal: React.FC<BecomeSellerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [salerInfo, setSalerInfo] = useState<SalerInfo>({
    companyName: '',
    description: '',
    schedule: '',
    contacts: [{ type: '', value: '' }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!salerInfo.companyName.trim()) {
      newErrors.companyName = 'Назва компанії обов\'язкова';
    }

    if (!salerInfo.description.trim()) {
      newErrors.description = 'Опис обов\'язковий';
    }

    if (!salerInfo.schedule.trim()) {
      newErrors.schedule = 'Графік роботи обов\'язковий';
    }

    // Валідація контактів
    const validContacts = salerInfo.contacts.filter(contact => 
      contact.type.trim() && contact.value.trim()
    );

    if (validContacts.length === 0) {
      newErrors.contacts = 'Потрібен хоча б один контакт';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Omit<SalerInfo, 'contacts'>, value: string) => {
    setSalerInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Очищаємо помилку для цього поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...salerInfo.contacts];
    newContacts[index] = {
      ...newContacts[index],
      [field]: value
    };
    setSalerInfo(prev => ({
      ...prev,
      contacts: newContacts
    }));

    // Очищаємо помилку контактів
    if (errors.contacts) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.contacts;
        return newErrors;
      });
    }
  };

  const addContact = () => {
    setSalerInfo(prev => ({
      ...prev,
      contacts: [...prev.contacts, { type: '', value: '' }]
    }));
  };

  const removeContact = (index: number) => {
    if (salerInfo.contacts.length > 1) {
      setSalerInfo(prev => ({
        ...prev,
        contacts: prev.contacts.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Фільтруємо тільки заповнені контакти
    const filteredContacts = salerInfo.contacts.filter(contact => 
      contact.type.trim() && contact.value.trim()
    );

    const finalSalerInfo = {
      ...salerInfo,
      contacts: filteredContacts
    };

    onSubmit(finalSalerInfo);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Скидаємо форму при закритті
      setSalerInfo({
        companyName: '',
        description: '',
        schedule: '',
        contacts: [{ type: '', value: '' }]
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
     <div
    className="
      fixed inset-0 z-[1000]
      flex items-center justify-center
      p-4
      bg-[#1b210f]/55       /* затемнення по всьому екрану */
      backdrop-blur-sm      /* легкий блюр фону */
    "
    role="dialog"
    aria-modal="true"
    onClick={handleClose}   /* клік поза модалкою — закриває */
  >
    <div
      className="
        relative w-full max-w-3xl
        max-h-[90vh] overflow-y-auto
        rounded-2xl
        border-2 border-[#3E4826]          /* ОЛИВКОВИЙ БОРДЕР */
        bg-gradient-to-br                  /* СВІТЛО-ЗЕЛЕНИЙ ФОН */
        from-[#EEF2E3] to-[#E6ECD8]        /* підбери відтінки під свій */
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
      "
      onClick={(e) => e.stopPropagation()} /* не закривати при кліку всередині */
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2b3924]">Стати спорядником</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-[#2b3924]/70 hover:text-[#2b3924] text-xl font-bold disabled:opacity-50"
          >
            ×
          </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Назва компанії */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Назва компанії 
              </label>
              <input
                type="text"
                id="companyName"
                value={salerInfo.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#454E30] ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введіть назву вашої компанії"
                disabled={isLoading}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Опис */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Опис діяльності
              </label>
              <textarea
                id="description"
                rows={4}
                value={salerInfo.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#454E30] resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Опишіть вашу діяльність, досвід, типи товарів..."
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Графік роботи */}
            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
                Графік роботи 
              </label>
              <textarea
                id="schedule"
                rows={3}
                value={salerInfo.schedule}
                onChange={(e) => handleInputChange('schedule', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#454E30] resize-none ${
                  errors.schedule ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Наприклад: Пн-Пт 9:00-18:00, Сб 10:00-15:00"
                disabled={isLoading}
              />
              {errors.schedule && (
                <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>
              )}
            </div>

            {/* Контакти */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Контакти 
              </label>
              {salerInfo.contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <select
                    value={contact.type}
                    onChange={(e) => handleContactChange(index, 'type', e.target.value)}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#454E30]"
                    disabled={isLoading}
                  >
                    <option value="">Тип контакту</option>
                    <option value="telegram">Telegram</option>
                    <option value="phone">Телефон</option>
                    <option value="signal">Signal</option>
                    <option value="email">Email</option>
                    <option value="viber">Viber</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#454E30]"
                    placeholder="Значення контакту"
                    disabled={isLoading}
                  />
                  {salerInfo.contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Видалити
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addContact}
                className="text-[#454E30] hover:text-[#5a6b3b] font-medium text-sm disabled:opacity-50"
                disabled={isLoading}
              >
                + Додати контакт
              </button>
              
              {errors.contacts && (
                <p className="text-red-500 text-sm mt-1">{errors.contacts}</p>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#454E30] text-white rounded-md hover:bg-[#5a6b3b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Обробка...
                  </>
                ) : (
                  'Стати спорядником'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setActiveRole, setUser } from "../../../entities/user/model/userSlice";
import { useRequest } from "@shared/request/useRequest";
import type { SalerInfoDto } from '@shared/types/api';


interface Contact {
  type: string;
  value: string;
}

interface SalerInfo {
  companyName: string;
  description: string;
  schedule: string;
  contacts: Contact[];
}

export const BecomeSellerButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { request: baseRequest } = useRequest();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
/*
  const handleSubmitSalerInfo = async (salerInfo: SalerInfo) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Отправляем запрос на сервер с информацией о продавце
      await baseRequest(`/api/users/make-saler`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          salerInfo: salerInfo
        }),
      });

      // Если запрос успешен, обновляем состояние пользователя
      const updatedUser = {
        ...user,
        roles: [...new Set([...user.roles, "Saler"])],
      };
      
      dispatch(setUser(updatedUser));
      dispatch(setActiveRole("Saler"));
      
      // Закрываем модальное окно
      setIsModalOpen(false);
      
      // Перенаправляем на главную страницу
      window.location.hash = "#home";
      
    } catch (error) {
      console.error("Ошибка при создании профиля продавца:", error);
      alert("Не вдалося стати спорядником. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };
*/
const handleSubmitSalerInfo = async (salerInfo: SalerInfo) => {
  if (!user) return;
  setIsLoading(true);

  try {
    // 1) Делаем апгрейд в продавца
    await baseRequest(`/api/users/make-saler`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, salerInfo }),
    });

    // 2) Сразу получаем его salerInfo, чтобы взять sellerId
    const si = await baseRequest<SalerInfoDto>(`/api/salerinfo/by-user/${user.id}`);

    // 3) Обновляем user в сторе (роль + опционально сохраняем sellerInfoId)
    const updatedUser: any = {
      ...user,
      roles: [...new Set([...(user.roles ?? []), "Saler"])],
      sellerInfoId: si?.id, // если хочешь хранить
    };

    dispatch(setUser(updatedUser));
    dispatch(setActiveRole("Saler"));

    setIsModalOpen(false);
    // Можно оставить, если хочешь вернуться на главную:
    // window.location.hash = "#home";
  } catch (error) {
    console.error("Ошибка при создании профиля продавца:", error);
    alert("Не вдалося стати спорядником. Спробуйте ще раз.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <button
        className="bg-[#454E30] hover:bg-[#5a6b3b] text-white font-semibold py-2 px-4 rounded transition-colors"
        onClick={handleOpenModal}
        disabled={isLoading}
      >
        Стати спорядником
      </button>

      <BecomeSellerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSalerInfo}
        isLoading={isLoading}
      />
    </>
  );
};
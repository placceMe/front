import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/uk"; // Українська локаль
import type { StatusMeta, StatusKey, FeedbackDto } from "../types/feedback";

// Підключаємо плагін для роботи з відносним часом
dayjs.extend(relativeTime);
dayjs.locale("uk"); // Встановлюємо українську мову

export const getStatusMeta = (): Record<
  StatusKey,
  Omit<StatusMeta, "icon"> & { iconName: string }
> => ({
  pending: {
    label: "На розгляді",
    color: "warning",
    iconName: "ClockCircleOutlined",
  },
  approved: {
    label: "Схвалено",
    color: "success",
    iconName: "CheckCircleOutlined",
  },
  rejected: {
    label: "Відхилено",
    color: "error",
    iconName: "ExclamationCircleOutlined",
  },
});

const STATUS_META = getStatusMeta();

export const fmtDate = (dateStr: string): string => {
  return dayjs(dateStr).format("DD.MM.YYYY HH:mm");
};

export const getRelativeTime = (dateStr: string): string => {
  return dayjs(dateStr).fromNow();
};

export const calculateAverageRating = (feedback: FeedbackDto): number => {
  const { ratingService, ratingSpeed, ratingDescription, ratingAvailable } =
    feedback;
  return (
    (ratingService + ratingSpeed + ratingDescription + ratingAvailable) / 4
  );
};

export const exportToCSV = (
  data: FeedbackDto[],
  filename: string = `feedback_${dayjs().format("YYYY-MM-DD")}.csv`
) => {
  const dataToExport = data.map((f) => ({
    id: f.id,
    createdAt: fmtDate(f.createdAt),
    user: `${f.user?.name ?? ""} ${f.user?.surname ?? ""}`.trim() || f.userId,
    product: f.productName ?? f.productId,
    status: STATUS_META[f.status]?.label || f.status,
    ratingService: f.ratingService,
    ratingSpeed: f.ratingSpeed,
    ratingDescription: f.ratingDescription,
    ratingAvailable: f.ratingAvailable,
    ratingAverage: calculateAverageRating(f).toFixed(1),
    content: f.content,
  }));

  const csv = [
    Object.keys(dataToExport[0] || {}).join(","),
    ...dataToExport.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getStatusColor = (status: StatusKey): string => {
  const colors = {
    pending: "#faad14",
    approved: "#52c41a",
    rejected: "#ff4d4f",
  };
  return colors[status] || "#d9d9d9";
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

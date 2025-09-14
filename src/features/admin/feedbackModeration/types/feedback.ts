import { Dayjs } from "dayjs";

/* ===================== Типи для фідбеків ===================== */
export type FeedbackDto = {
  id: string;
  userId: string;
  productId: string;
  productName?: string;
  user?: {
    id: string;
    name: string;
    surname: string;
    avatar?: string;
  };
  content: string;
  status: StatusKey;
  createdAt: string;
  updatedAt?: string;
  ratingService: number;
  ratingSpeed: number;
  ratingDescription: number;
  ratingAvailable: number;
  ratingAverage?: number;
};

export type StatusKey = "New" | "Approved" | "Rejected";

export interface StatusMeta {
  label: string;
  color: string;
  icon: React.ReactNode;
}

export interface FeedbackFilters {
  search: string;
  status: StatusKey[];
  productId?: string;
  userId?: string;
  createdRange?: [Dayjs, Dayjs] | null;
  minAvg?: number;
  maxAvg?: number;
}

export interface FeedbackTableProps {
  data: FeedbackDto[];
  loading: boolean;
  selectedRows: string[];
  onRowSelectionChange: (selectedRowKeys: string[]) => void;
  onStatusChange: (id: string, status: StatusKey) => void;
  onDelete: (id: string) => void;
  onView: (feedback: FeedbackDto) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, size?: number) => void;
}

export interface FeedbackFiltersProps {
  filters: FeedbackFilters;
  onFiltersChange: (filters: Partial<FeedbackFilters>) => void;
  onReset: () => void;
  productOptions: { label: string; value: string }[];
  userOptions: { label: string; value: string }[];
  visible: boolean;
}

export interface FeedbackHeaderProps {
  total: number;
  filtered: number;
  selectedCount: number;
  autoRefresh: boolean;
  loading: boolean;
  onAutoRefreshToggle: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkDelete: () => void;
  onExport: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export interface FeedbackModalProps {
  feedback: FeedbackDto | null;
  visible: boolean;
  onClose: () => void;
  onStatusChange: (status: StatusKey) => void;
  onDelete: () => void;
}

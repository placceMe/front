import React, { useState } from "react";
import { Button, Modal, Alert, Typography } from "antd";

const currencyUAH = (v: number) =>
  new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH" }).format(v);

const TEST_AMOUNT_UAH = 20;
// Переключатель режима: true — фейк без бэка, false — реальный бэк
const MOCK = false;


const PaymentTestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const createInvoice = async () => {
    setLoading(true);
    setErr(null);
    setPageUrl(null);
    setInvoiceId(null);

    try {
      if (MOCK) {
        // --- МОК БЕЗ БЭКА ---
        await new Promise((r) => setTimeout(r, 600));
        setPageUrl("https://api.monobank.ua/payments/invoice/test_page_url");
        setInvoiceId("TEST-INVOICE-123");
        setOpen(true);
        return;
      }

      // --- РЕАЛЬНЫЙ ЗАПРОС К ТВОЕМУ БЭКУ ---
      const res = await fetch("http://localhost:5000/api/payments/create", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(TEST_AMOUNT_UAH * 100), // копейки
          displayType: "iframe",
          orderId: "ORDER-DEMO-1",
          email: "test@example.com",
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { pageUrl: string; invoiceId: string };

      setPageUrl(data.pageUrl);
      setInvoiceId(data.invoiceId);
      setOpen(true);
    } catch (e: any) {
      setErr(e?.message ?? "Create invoice failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div
        style={{
          width: 560,
          maxWidth: "100%",
          padding: 24,
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,.06)",
        }}
      >
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Тест оплати Mono
        </Typography.Title>
        <Typography.Paragraph>
          Сума: <b>{currencyUAH(TEST_AMOUNT_UAH)}</b> (песочниця).
        </Typography.Paragraph>

        <Button type="primary" size="large" onClick={createInvoice} loading={loading}>
          Оплатити Monobank (тест)
        </Button>

        {err && <Alert style={{ marginTop: 16 }} type="error" message="Помилка" description={err} />}

        <Modal
          title="Оплата Monobank (тест)"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          width={640}
          destroyOnClose
        >
          {!pageUrl ? (
            <Alert message="Готуємо платіжну сторінку…" type="info" />
          ) : (
            <iframe
              title="monobank-payment"
              src={pageUrl}
              style={{ width: "100%", height: 600, border: 0, borderRadius: 16 }}
              allow="payment *"
            />
          )}
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
            invoiceId: {invoiceId ?? "—"}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentTestPage;

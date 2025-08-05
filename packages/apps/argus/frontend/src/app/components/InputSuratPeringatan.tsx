'use client';

import {
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Result,
  message,
} from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import type { UploadFile } from 'antd/es/upload/interface';

type InputSuratPeringatanModalProps = {
  visible: boolean;
  onClose: () => void;
};

type SuratPeringatanFormData = {
  nomorSurat: string;
  tanggalRp: Date;
  alasanPeringatan: string;
  file: UploadFile[];
};

export default function InputSuratPeringatanModal({
  visible,
  onClose,
}: InputSuratPeringatanModalProps) {
  const [form] = Form.useForm<SuratPeringatanFormData>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const sanitizedValues: SuratPeringatanFormData = {
        ...values,
        nomorSurat: DOMPurify.sanitize(values.nomorSurat || ''),
        tanggalRp: values.tanggalRp,
        alasanPeringatan: DOMPurify.sanitize(values.alasanPeringatan || ''),
        file: values.file,
      };
      setLoading(true);
      console.log(sanitizedValues);
      setTimeout(() => {
        message.success('Surat peringatan berhasil disimpan.');
        setSubmitted(true);
        setLoading(false);
        form.resetFields();
      }, 1000);
    });
  };

  const handleCancel = () => {
    setSubmitted(false);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      title="Input Surat Peringatan"
      okButtonProps={{ loading }}
      footer={
        submitted
          ? null
          : [
              <Button key="cancel" onClick={handleCancel}>
                Batal
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleOk}
                loading={loading}
              >
                Simpan
              </Button>,
            ]
      }
    >
      {submitted ? (
        <Result
          status="success"
          icon={
            <CheckCircleOutlined style={{ color: 'green', fontSize: 64 }} />
          }
          title="Surat Peringatan Tersimpan!"
          subTitle="Data berhasil dikirim dan tersimpan di sistem."
          extra={
            <Button type="primary" onClick={handleCancel}>
              Tutup
            </Button>
          }
        />
      ) : (
        <Form layout="vertical" form={form}>
          <Form.Item
            name="nomorSurat"
            label="Nomor Surat Peringatan"
            rules={[{ required: true, message: 'Mohon isi nomor surat' }]}
          >
            <Input placeholder="Contoh: 123/SP/HRD/2025" />
          </Form.Item>

          <Form.Item
            name="tanggalRp"
            label="Tanggal Surat Peringatan"
            rules={[{ required: true, message: 'Mohon pilih tanggal' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="alasanPeringatan"
            label="Alasan Peringatan"
            rules={[{ required: true, message: 'Mohon isi alasan peringatan' }]}
          >
            <Input placeholder="Delivery Aplikasi Terlambat" />
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload File Surat"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: 'Mohon upload file' }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Pilih File</Button>
            </Upload>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

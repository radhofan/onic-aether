'use client';

import {
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  InputNumber,
  Result,
  message,
  Select,
} from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadFile } from 'antd';
import type { FormItemProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { Kontrak } from '@onic/argus-frontend/types/types';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';

type InputAmandemenModalProps = {
  visible: boolean;
  onClose: () => void;
  kontrak: Kontrak[];
};

type AmandemenFormData = {
  nomorKontrak: string;
  nomorAmandemen: string;
  perubahanKontrak: string;
  perubahanDireksi?: string;
  perubahanPengawas?: string;
  tanggalBerlaku: Dayjs;
  nilaiKontrak: number;
  oldTermin?: number;
  perubahanTermin?: string;
  file: UploadFile[];
};

export default function InputAmandemenModal({
  visible,
  onClose,
  kontrak,
}: InputAmandemenModalProps) {
  const [form] = Form.useForm<AmandemenFormData>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const perubahanDireksi = values.perubahanDireksi?.trim();
      const perubahanPengawas = values.perubahanPengawas?.trim();
      const tanggalBerlaku = values.tanggalBerlaku;
      const nilaiKontrak = values.nilaiKontrak;

      const atLeastOneFilled =
        !!perubahanDireksi ||
        !!perubahanPengawas ||
        (tanggalBerlaku && dayjs(tanggalBerlaku).isValid()) ||
        (!!nilaiKontrak && nilaiKontrak > 0);

      if (!atLeastOneFilled) {
        message.error('Please fill at least one field of the four required');

        form.setFields([
          {
            name: 'perubahanDireksi',
            errors: ['Fill at least one field'],
          },
          {
            name: 'perubahanPengawas',
            errors: ['Fill at least one field'],
          },
          {
            name: 'tanggalBerlaku',
            errors: ['Fill at least one field'],
          },
          {
            name: 'nilaiKontrak',
            errors: ['Fill at least one field'],
          },
        ]);

        return;
      }

      const sanitizedValues = {
        ...values,
        nomorKontrak: DOMPurify.sanitize(values.nomorKontrak),
        nomorAmandemen: DOMPurify.sanitize(values.nomorAmandemen),
        perubahanKontrak: DOMPurify.sanitize(values.perubahanKontrak),
        perubahanDireksi: perubahanDireksi
          ? DOMPurify.sanitize(perubahanDireksi)
          : undefined,
        perubahanPengawas: perubahanPengawas
          ? DOMPurify.sanitize(perubahanPengawas)
          : undefined,
        tanggalBerlaku: values.tanggalBerlaku?.toDate(),
        nilaiKontrak: values.nilaiKontrak,
        oldTermin: values.oldTermin,
        perubahanTermin: values.perubahanTermin
          ? DOMPurify.sanitize(values.perubahanTermin)
          : undefined,
        file: values.file,
      };

      setLoading(true);
      console.log(sanitizedValues);
      setTimeout(() => {
        message.success('Amandemen berhasil disimpan (dummy)');
        setLoading(false);
        setSubmitted(true);
        form.resetFields();
      }, 1000);
    } catch (err) {
      console.log('Validation failed', err);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const normFile: NonNullable<FormItemProps['getValueFromEvent']> = (e) => {
    return Array.isArray(e) ? e : (e?.fileList ?? []);
  };

  return (
    <Modal
      open={visible}
      title="Input Amandemen Kontrak"
      onCancel={handleClose}
      footer={null}
      width={700}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      {submitted ? (
        <Result
          status="success"
          icon={
            <CheckCircleOutlined style={{ color: 'green', fontSize: 64 }} />
          }
          title="Amandemen Berhasil Disimpan!"
          subTitle="Data amandemen telah berhasil diunggah dan dicatat."
          extra={[
            <Button type="primary" key="close" onClick={handleClose}>
              Tutup
            </Button>,
          ]}
        />
      ) : (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="nomorKontrak"
            label="Pilih Nomor Kontrak"
            rules={[{ required: true, message: 'Mohon pilih nomor kontrak' }]}
          >
            <Select placeholder="Pilih nomor kontrak">
              {kontrak.map((item) => (
                <Select.Option key={item.key} value={item.nomorKontrak}>
                  {item.nomorKontrak}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nomorAmandemen"
            label="Nomor Amandemen Kontrak"
            rules={[{ required: true, message: 'Mohon isi nomor amandemen' }]}
          >
            <Input placeholder="Contoh: AMD-2025-001" />
          </Form.Item>

          <Form.Item
            name="perubahanKontrak"
            label="Input Deskripsi Perubahan Kontrak"
            rules={[{ required: true, message: 'Mohon isi perubahan kontrak' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="perubahanDireksi"
            label="Perubahan Direksi Pekerjaan"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="perubahanPengawas"
            label="Perubahan Pengawas Pekerjaan"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tanggalBerlaku"
            label="Perubahan Tanggal Berlaku Kontrak"
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="nilaiKontrak" label="Perubahan Nilai Kontrak">
            <InputNumber<number>
              style={{ width: '100%' }}
              min={0}
              formatter={(value) =>
                `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
              }
              parser={(value) =>
                value ? parseInt(value.replace(/[^0-9]/g, ''), 10) : 0
              }
            />
          </Form.Item>

          <Form.Item label="Perubahan Termin">
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Item
                name="oldTermin"
                initialValue={3}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input disabled placeholder="Jumlah termin sebelumnya" />
              </Form.Item>

              <Form.Item
                name="perubahanTermin"
                style={{ flex: 1, marginBottom: 0 }}
                rules={[
                  {
                    validator: (_, value) => {
                      const oldValue = form.getFieldValue('oldTermin');
                      if (
                        value === undefined ||
                        value === null ||
                        value === ''
                      ) {
                        return Promise.resolve();
                      }
                      if (value >= oldValue) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          'Jumlah termin baru harus sama atau lebih dari termin sebelumnya'
                        )
                      );
                    },
                  },
                ]}
              >
                <InputNumber
                  placeholder="Jumlah termin baru"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload File Amandemen"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Mohon upload file' }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Pilih File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Submit Amandemen
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

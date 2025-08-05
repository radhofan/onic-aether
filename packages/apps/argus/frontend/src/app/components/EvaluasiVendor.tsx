'use client';

import { useState } from 'react';
import { Modal, Form, Select, Button, Row, Col, Result } from 'antd';
import { Kontrak } from '@onic/argus-frontend/types/types';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface EvaluasiVendorModalProps {
  visible: boolean;
  data: Kontrak;
  onClose: () => void;
}

export default function EvaluasiVendorModal({
  visible,
  data,
  onClose,
}: EvaluasiVendorModalProps) {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Submitted Evaluasi:', values);
      // Simulate API call
      setTimeout(() => {
        setSubmitted(true);
        form.resetFields();
      }, 800);
    });
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      title="Evaluasi Vendor"
    >
      {submitted ? (
        <Result
          status="success"
          icon={
            <CheckCircleOutlined style={{ color: 'green', fontSize: 64 }} />
          }
          title="Evaluasi Berhasil Dikirim!"
          subTitle="Data evaluasi vendor telah disimpan dengan baik."
          extra={[
            <Button type="primary" key="close" onClick={handleClose}>
              Tutup
            </Button>,
          ]}
        />
      ) : (
        <>
          <p>
            <strong>Nama Proyek:</strong> {data.namaPekerjaan}
          </p>
          <p>
            <strong>Tanggal Berlaku Kontrak:</strong> {data.tanggalMulai}
          </p>
          <p>
            <strong>Tanggal Selesai Kontrak:</strong> {data.tanggalSelesai}
          </p>

          <Form layout="vertical" form={form}>
            <Form.Item
              name="ketepatanWaktu"
              label="1. Ketepatan Waktu (40%)"
              rules={[{ required: true, message: 'Harap pilih nilai.' }]}
            >
              <Select
                placeholder={
                  data.infoEvaluasi === 'Selesai'
                    ? '95 - Sesuai jadwal (disabled)'
                    : 'Pilih nilai ketepatan waktu'
                }
                disabled={data.infoEvaluasi === 'Selesai'}
                defaultValue={data.infoEvaluasi === 'Selesai' ? 95 : undefined}
              >
                <Option value={100}>100 - Selesai lebih cepat</Option>
                <Option value={95}>95 - Sesuai jadwal</Option>
                <Option value={65}>65 - Terlambat ≤ 10%</Option>
                <Option value={40}>40 - Terlambat 10-30%</Option>
                <Option value={30}>30 - Terlambat &gt; 30%</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="kualitasPekerjaan"
              label="2. Kualitas Pekerjaan (30%)"
              rules={[{ required: true, message: 'Harap pilih nilai.' }]}
            >
              <Select
                placeholder={
                  data.infoEvaluasi === 'Selesai'
                    ? '80 – Baik (disabled)'
                    : 'Pilih nilai kualitas pekerjaan'
                }
                disabled={data.infoEvaluasi === 'Selesai'}
                defaultValue={data.infoEvaluasi === 'Selesai' ? 80 : undefined}
              >
                <Option value={100}>
                  100 – Sesuai ekspektasi, tidak ada temuan major
                </Option>
                <Option value={80}>
                  80 – Baik, tidak ada temuan major tapi ada improvement
                </Option>
                <Option value={60}>60 – Revisi ≤ 30%</Option>
                <Option value={30}>
                  30 – Tidak sesuai standar, temuan major tidak diperbaiki
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="komunikasi"
              label="3. Komunikasi & Dokumentasi (30%)"
              rules={[{ required: true, message: 'Harap pilih nilai.' }]}
            >
              <Select
                placeholder={
                  data.infoEvaluasi === 'Selesai'
                    ? '80 – Respons cepat (disabled)'
                    : 'Pilih nilai komunikasi & dokumentasi'
                }
                disabled={data.infoEvaluasi === 'Selesai'}
                defaultValue={data.infoEvaluasi === 'Selesai' ? 80 : undefined}
              >
                <Option value={100}>
                  100 – Respons sangat cepat, dokumen lengkap & rapi
                </Option>
                <Option value={80}>
                  80 – Respons cepat, dokumen lengkap (perbaikan minor)
                </Option>
                <Option value={60}>
                  60 – Respons lambat, dokumen perlu revisi major
                </Option>
                <Option value={30}>
                  30 – Respons lambat, dokumen terlambat
                </Option>
              </Select>
            </Form.Item>

            {data.infoEvaluasi !== 'Selesai' && (
              <Row justify="end">
                <Col>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </>
      )}
    </Modal>
  );
}

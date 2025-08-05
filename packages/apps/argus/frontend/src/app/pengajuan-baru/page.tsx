'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Divider,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Space,
  Radio,
  Button,
  Result,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import { CheckCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from 'zustand';
import { authStore } from '@/stores/useAuthStore';

const { Title, Text } = Typography;
const { Option } = Select;

type FormState = {
  namaPekerjaan: string;
  tipePekerjaan: string;
  bidangPekerjaan: string;
  direksi: string;
  pengawas: string;
  vendor: string;
  nilai: number | null;
  nomorKontrak: string;
  tanggalMulai: dayjs.Dayjs | null;
  tanggalSelesai: dayjs.Dayjs | null;
};

export default function PengajuanBaruPage() {
  const user = useStore(authStore, (s) => s.user);
  const router = useRouter();

  const [terminType, setTerminType] = useState<'milestone' | 'tanggal'>(
    'milestone'
  );
  const [milestoneCount, setMilestoneCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    namaPekerjaan: '',
    tipePekerjaan: '',
    bidangPekerjaan: user?.subBidang || '',
    direksi: '',
    pengawas: '',
    vendor: '',
    nilai: null,
    nomorKontrak: '',
    tanggalMulai: null,
    tanggalSelesai: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const validateForm = (): Partial<Record<keyof FormState, string>> => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.namaPekerjaan.trim()) newErrors.namaPekerjaan = 'Wajib diisi';
    if (!form.tipePekerjaan) newErrors.tipePekerjaan = 'Wajib diisi';
    if (!form.direksi.trim()) newErrors.direksi = 'Wajib diisi';
    if (!form.pengawas.trim()) newErrors.pengawas = 'Wajib diisi';
    if (!form.vendor) newErrors.vendor = 'Wajib diisi';
    if (form.nilai === null) newErrors.nilai = 'Wajib diisi';
    if (!form.nomorKontrak.trim()) newErrors.nomorKontrak = 'Wajib diisi';
    if (!form.tanggalMulai) newErrors.tanggalMulai = 'Wajib diisi';
    if (!form.tanggalSelesai) newErrors.tanggalSelesai = 'Wajib diisi';
    return newErrors;
  };

  const handleInputChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsModalVisible(true);
    }, 1200);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    router.push('/');
  };

  return (
    <div style={{ padding: 24 }}>
      <AnimatePresence mode="wait">
        {!isModalVisible ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Title level={2}>Pengajuan Kontrak Baru</Title>
            <Divider />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Title level={4}>1. Informasi Umum</Title>
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="large"
              >
                {(
                  [
                    { label: 'Nama Pekerjaan *', field: 'namaPekerjaan' },
                    { label: 'Direksi Pekerjaan *', field: 'direksi' },
                    { label: 'Pengawas Pekerjaan *', field: 'pengawas' },
                    { label: 'Nomor Kontrak *', field: 'nomorKontrak' },
                  ] as const
                ).map(({ label, field }) => (
                  <motion.div key={field} layout>
                    <Text>{label}</Text>
                    <Input
                      placeholder="Input Chars"
                      value={form[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      status={errors[field] ? 'error' : ''}
                    />
                  </motion.div>
                ))}

                <div>
                  <Text>Tipe Pekerjaan *</Text>
                  <Select
                    placeholder="Pilih tipe pekerjaan"
                    value={form.tipePekerjaan || undefined}
                    onChange={(val) => handleInputChange('tipePekerjaan', val)}
                    status={errors.tipePekerjaan ? 'error' : ''}
                    style={{ width: '100%' }}
                  >
                    <Option value="change">
                      Pengembangan / Change Request
                    </Option>
                    <Option value="ophar">Pemeliharaan / Ophar</Option>
                  </Select>
                </div>

                <div>
                  <Text>Bidang Pekerjaan *</Text>
                  <Input
                    value={form.bidangPekerjaan}
                    disabled
                    placeholder={user?.subBidang}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <Text>Nama Vendor KHS *</Text>
                  <Select
                    placeholder="Pilih Vendor"
                    value={form.vendor || undefined}
                    onChange={(val) => handleInputChange('vendor', val)}
                    status={errors.vendor ? 'error' : ''}
                    style={{ width: '100%' }}
                  >
                    <Option value="akhdani">
                      PT Akhdani Reka Solusi (Akhdani)
                    </Option>
                    <Option value="pds">PT Prima Data Semesta (PDS)</Option>
                    <Option value="iglo">
                      PT Indocyber Global Teknologi (IGLO)
                    </Option>
                    <Option value="webcenter">
                      PT Webcenter Sentra Solusindo
                    </Option>
                    <Option value="ddn">PT Duta Digital Nusantara (DDN)</Option>
                    <Option value="bangunindo">
                      PT Bangunindo Tekunsa Jaya
                    </Option>
                    <Option value="ecomindo">PT Ecomindo Saranacipta</Option>
                  </Select>
                </div>

                <div>
                  <Text>Nilai Pekerjaan Total *</Text>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Input Number"
                    value={form.nilai ?? undefined}
                    formatter={(value) =>
                      `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    }
                    parser={(value) =>
                      value ? parseInt(value.replace(/[^0-9]/g, ''), 10) : 0
                    }
                    onChange={(val) => handleInputChange('nilai', val)}
                    status={errors.nilai ? 'error' : ''}
                  />
                </div>

                <div>
                  <Text>Tanggal Berlaku Kontrak *</Text>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={form.tanggalMulai}
                    onChange={(date) => handleInputChange('tanggalMulai', date)}
                    status={errors.tanggalMulai ? 'error' : ''}
                    disabledDate={(current) =>
                      form.tanggalSelesai
                        ? current && current.isAfter(form.tanggalSelesai)
                        : false
                    }
                  />
                </div>

                <div>
                  <Text>Tanggal Selesai Kontrak *</Text>
                  <DatePicker
                    style={{ width: '100%' }}
                    value={form.tanggalSelesai}
                    onChange={(date) =>
                      handleInputChange('tanggalSelesai', date)
                    }
                    status={errors.tanggalSelesai ? 'error' : ''}
                    disabledDate={(current) =>
                      form.tanggalMulai
                        ? current && current.isBefore(form.tanggalMulai)
                        : false
                    }
                  />
                </div>
              </Space>
            </motion.div>

            <Divider />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Title level={4}>2. Termin Pembayaran</Title>
              <Radio.Group
                onChange={(e) => setTerminType(e.target.value)}
                value={terminType}
                style={{ marginBottom: 16 }}
              >
                <Radio value="milestone">Termin Milestones</Radio>
                <Radio value="tanggal">Termin Tanggal</Radio>
              </Radio.Group>

              {terminType === 'milestone' ? (
                <>
                  <p>Input Jumlah Termin (1–12)</p>
                  <InputNumber
                    min={1}
                    max={10}
                    value={milestoneCount}
                    onChange={(value) => setMilestoneCount(value || 1)}
                    style={{ width: '100%' }}
                  />
                </>
              ) : (
                <>
                  <p>Input Tanggal Pembayaran Rutin (1–30)</p>
                  <InputNumber
                    style={{ width: '100%' }}
                    value={milestoneCount}
                    placeholder="1–30"
                  />
                </>
              )}
            </motion.div>

            <Divider />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Title level={4}>3. Dokumen Administrasi</Title>
              <Upload.Dragger
                multiple
                beforeUpload={() => false}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                style={{ padding: 12 }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Klik atau drag file ke area ini untuk mengunggah
                </p>
                <p className="ant-upload-hint">
                  Bisa unggah beberapa file sekaligus
                </p>
              </Upload.Dragger>
            </motion.div>

            <motion.div
              style={{ marginTop: 24 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
                block
              >
                Submit
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Result
              status="success"
              title="Kontrak Berhasil Diajukan!"
              subTitle="Pengajuan kontrak berhasil dikirim dan sedang diproses."
              icon={
                <CheckCircleOutlined style={{ color: 'green', fontSize: 64 }} />
              }
              extra={[
                <Button type="primary" key="ok" onClick={handleModalOk}>
                  Kembali ke Daftar Kontrak
                </Button>,
              ]}
              style={{ paddingTop: 60 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

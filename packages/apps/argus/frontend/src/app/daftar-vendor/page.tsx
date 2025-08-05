'use client';

import { useRouter } from 'next/navigation';
import { Typography, Table, Card, Button, Input, Space } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { vendor, kontrak } from '@/types/dummy';
import { useStore } from 'zustand';
import { authStore } from '@/stores/useAuthStore';

const { Title } = Typography;

import type { Vendor } from '@/types/types';

export default function DaftarVendorPage() {
  const router = useRouter();
  const user = useStore(authStore, (s) => s.user);
  const [, setSearchText] = useState('');
  const [, setSearchedColumn] = useState<keyof Vendor | ''>('');

  const handleClick = (record: Vendor) => {
    router.push(`/daftar-vendor/${record.key}`);
  };

  const getColumnSearchProps = (
    dataIndex: keyof Vendor
  ): ColumnType<Vendor> => {
    const isNumeric =
      dataIndex === 'nilaiKeseluruhan' ||
      dataIndex === 'evaluasiVendor' ||
      dataIndex === 'totalProyek';

    if (isNumeric) {
      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }: FilterDropdownProps) => {
          const rangeValue = String(selectedKeys[0] || '');
          const [min = '', max = ''] = rangeValue.includes(',')
            ? rangeValue.split(',')
            : ['', ''];
          return (
            <div style={{ padding: 8 }}>
              <Input
                placeholder="Min"
                type="number"
                min={0}
                value={min}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedKeys([`${val},${max}`]);
                }}
                style={{ width: 80, marginBottom: 8, marginRight: 8 }}
              />
              <Input
                placeholder="Max"
                type="number"
                min={0}
                value={max}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedKeys([`${min},${val}`]);
                }}
                style={{ width: 80, marginBottom: 8 }}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    const minNum = Number(min);
                    const maxNum = Number(max);
                    if (
                      !isNaN(minNum) &&
                      !isNaN(maxNum) &&
                      minNum <= maxNum &&
                      minNum >= 0 &&
                      maxNum >= 0
                    ) {
                      confirm();
                      setSearchedColumn(dataIndex);
                    }
                  }}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Cari
                </Button>
                <Button
                  onClick={() => {
                    if (clearFilters) {
                      clearFilters();
                    }
                    confirm();
                    setSearchText('');
                  }}
                  size="small"
                  style={{ width: 90 }}
                >
                  Reset
                </Button>
              </Space>
            </div>
          );
        },
        onFilter: (value: React.Key | boolean, record: Vendor) => {
          const rangeStr = String(value);
          const [minStr = '', maxStr = ''] = rangeStr.includes(',')
            ? rangeStr.split(',')
            : ['', ''];
          const min = Number(minStr);
          const max = Number(maxStr);
          const recordVal = Number(record[dataIndex]);
          if (!isNaN(min) && !isNaN(max) && min >= 0 && max >= 0) {
            return recordVal >= min && recordVal <= max;
          }
          return true;
        },
      };
    }

    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Cari ${dataIndex}`}
            value={String(selectedKeys[0] || '')}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              confirm();
              setSearchedColumn(dataIndex);
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                setSearchedColumn(dataIndex);
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Cari
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) {
                  clearFilters();
                }
                confirm();
                setSearchText('');
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: React.Key | boolean, record: Vendor) =>
        String(record[dataIndex])
          .toLowerCase()
          .includes(String(value).toLowerCase()),
    };
  };

  const headerStyle = {
    backgroundColor: '#1f2937',
    color: 'white',
    border: '1px solid #3f3f46',
  };

  const cellStyle = {
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
  };

  const columns: ColumnsType<Vendor> = [
    {
      title: 'Nama Vendor',
      dataIndex: 'namaVendor',
      key: 'namaVendor',
      ...getColumnSearchProps('namaVendor'),
      onHeaderCell: () => ({ style: headerStyle }),
      onCell: () => ({ style: cellStyle }),
    },
    {
      title: 'Nilai Keseluruhan',
      dataIndex: 'nilaiKeseluruhan',
      key: 'nilaiKeseluruhan',
      sorter: (a, b) => a.nilaiKeseluruhan - b.nilaiKeseluruhan,
      ...getColumnSearchProps('nilaiKeseluruhan'),
      onHeaderCell: () => ({ style: headerStyle }),
      onCell: () => ({ style: cellStyle }),
    },
    {
      title: 'Evaluasi Vendor',
      dataIndex: 'evaluasiVendor',
      key: 'evaluasiVendor',
      sorter: (a, b) => a.evaluasiVendor - b.evaluasiVendor,
      ...getColumnSearchProps('evaluasiVendor'),
      onHeaderCell: () => ({ style: headerStyle }),
      onCell: () => ({ style: cellStyle }),
    },
    {
      title: 'Surat Peringatan',
      dataIndex: 'suratPeringatan',
      key: 'suratPeringatan',
      filters: [
        { text: 'Ada', value: 'Ada' },
        { text: 'Tidak ada', value: 'Tidak ada' },
      ],
      onFilter: (value, record) => record.suratPeringatan === value,
      onHeaderCell: () => ({ style: headerStyle }),
      onCell: () => ({ style: cellStyle }),
    },
    {
      title: 'Total Proyek di STI',
      dataIndex: 'totalProyek',
      key: 'totalProyek',
      sorter: (a, b) => a.totalProyek - b.totalProyek,
      ...getColumnSearchProps('totalProyek'),
      onHeaderCell: () => ({ style: headerStyle }),
      onCell: () => ({ style: cellStyle }),
    },
    {
      title: 'Total Proyek di Bidang',
      key: 'totalProyek',
      render: (_, record) => {
        const count = kontrak.filter(
          (k) => k.vendorKey === record.key && k.subBidang === user?.subBidang
        ).length;
        return count;
      },
      sorter: (a, b) => {
        const aCount = kontrak.filter(
          (k) => k.vendorKey === a.key && k.subBidang === user?.subBidang
        ).length;
        const bCount = kontrak.filter(
          (k) => k.vendorKey === b.key && k.subBidang === user?.subBidang
        ).length;
        return aCount - bCount;
      },
      ...getColumnSearchProps('totalProyek'),
      onHeaderCell: () => ({ style: headerStyle }),
      onCell: () => ({ style: cellStyle }),
    },
    {
      title: 'Lihat Vendor',
      dataIndex: 'key',
      key: 'key',
      render: (_: string, record: Vendor) => (
        <Button type="primary" onClick={() => handleClick(record)}>
          Lihat Detil
        </Button>
      ),
      onHeaderCell: () => ({ style: headerStyle }),
      onCell: () => ({ style: cellStyle }),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: 24 }}
    >
      <Card>
        <Title level={3} style={{ marginBottom: 24 }}>
          View Monitoring Vendor
        </Title>
        <Table
          dataSource={vendor}
          columns={columns}
          pagination={{ pageSize: 8 }}
          bordered
          rowKey="key"
          scroll={{ x: true }}
        />
      </Card>
    </motion.div>
  );
}

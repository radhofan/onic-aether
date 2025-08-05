'use client';

import { Card, Col, Row, Statistic, Tag } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';

export default function DataDashboard() {
  const totalKontrak = 4;
  const kontrakSelesai = 2;
  const kontrakSedangBerjalan = totalKontrak - kontrakSelesai;
  const kontrakTerbayar = 1;
  const kontrakBelumTerbayar = kontrakSelesai - kontrakTerbayar;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="stretch">
      <Col span={8}>
        <Card style={{ border: '1px solid #c5c5c5ff', height: '100%' }}>
          <Statistic
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Kontrak Sedang Berjalan
              </span>
            }
            value={kontrakSedangBerjalan}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ border: '1px solid #c5c5c5ff', height: '100%' }}>
          <Statistic
            title={
              <span>
                <CheckCircleOutlined style={{ marginRight: 8 }} />
                Kontrak Selesai
              </span>
            }
            value={kontrakSelesai}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ border: '1px solid #c5c5c5ff', height: '100%' }}>
          <div>
            <span>
              <DollarCircleOutlined style={{ marginRight: 8 }} />
              Status Pembayaran Kontrak Selesai
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '8px',
                gap: '4px',
                width: '50%',
              }}
            >
              <Tag color="green">Terbayar Semua: {kontrakTerbayar}</Tag>
              <Tag color="orange">Terbayar Sebagian: {kontrakTerbayar}</Tag>
              <Tag color="red">
                Belum Terbayar Semua: {kontrakBelumTerbayar}
              </Tag>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

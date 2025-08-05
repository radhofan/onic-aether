'use client';

import { Button, Form, Input, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const { Title, Link, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  type LoginFormValues = {
    email: string;
    password: string;
  };

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        message.success('Login successful!');
        router.push('/');
      } else {
        message.error(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      message.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
      }}
    >
      <Title
        level={3}
        style={{
          // #001529
          backgroundColor: '#007bff',
          color: '#007bff',
          width: '100%',
          textAlign: 'center',
          margin: 0,
          padding: '12px 0',
        }}
      >
        Aplikasi Monitoring KHS
      </Title>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          padding: '24px 16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Image src="/pln-logo.png" alt="PLN Logo" width={50} height={50} />
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>
            Aplikasi Monitoring KHS
          </div>
          <div style={{ marginTop: 8 }}>Log In</div>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          style={{ width: 300 }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
            >
              Log In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <label>
              <input
                type="checkbox"
                defaultChecked
                style={{ marginRight: 4 }}
              />
              User notice
            </label>
            <div style={{ marginTop: 8 }}>
              <Link href="#">Register</Link> |{' '}
              <Link href="#">Forget password</Link>
            </div>
          </div>
        </Form>

        <Text type="secondary" style={{ marginTop: 32, fontSize: 12 }}>
          Thanks for connecting to Wi-Fi. We will make every effort to offer you
          a better service.
        </Text>
      </div>
    </div>
  );
}

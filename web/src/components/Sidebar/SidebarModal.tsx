import {
  CalendarOutlined,
  HomeOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Button, Menu, Modal, Tooltip } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { authContext } from '../../store/auth';

const ResponsiveContainer = styled.div`
  display: none;
  @media (max-width: 950px) {
    display: block;
    position: fixed;
    top: 50vh;
    right: 10px;
    z-index: 1000;
  }
`;

const Title = styled.div`
  padding: 25px;
  width: 100%;
`;

export default function SidebarModal(): ReactElement {
  const { userType } = useContext(authContext);
  const location = useLocation();
  const [showModal, setShowModal] = useState<boolean>(false);

  let menu;
  menu =
    userType === 'owner' ? (
      <Menu
        style={{ width: '100%' }}
        mode="inline"
        defaultSelectedKeys={['/']}
        selectedKeys={[location.pathname]}
        onClick={() => setShowModal(false)}
      >
        <Menu.Item key="/">
          <InfoCircleOutlined />
          <Link to="/">Overview</Link>
        </Menu.Item>
        <Menu.Item key="/bookings">
          <CalendarOutlined />
          <Link to="/bookings">Book now</Link>
        </Menu.Item>
        <Menu.Item key="/pets">
          <HomeOutlined />
          <Link to="/pets">Pets</Link>
        </Menu.Item>
        <Menu.Item key="/profile">
          <IdcardOutlined />
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="/settings">
          <SettingOutlined />
          <Link to="/settings">Settings</Link>
        </Menu.Item>
      </Menu>
    ) : (
      <Menu style={{ width: 256 }} mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/">Overview</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/vets">Vets</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/settings">Settings</Link>
        </Menu.Item>
      </Menu>
    );

  return (
    <>
      <ResponsiveContainer>
        <Tooltip title="Open menu" placement="left">
          <Button
            shape="circle"
            onClick={() => setShowModal(true)}
            style={{
              background:
                'linear-gradient(10deg, #ffa55b 10% 30%, #ff895b 50% 100%)',
              opacity: 0.85,
              color: '#fff'
            }}
            size="large"
            type="text"
          >
            {showModal ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </Tooltip>
      </ResponsiveContainer>
      <Modal
        visible={showModal}
        bodyStyle={{ margin: 0, height: '100vh', padding: 0 }}
        style={{
          padding: 0,
          margin: 0,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }}
        width={300}
        maskStyle={{ padding: 0, margin: 0 }}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Title>Menu</Title>
        {menu}
      </Modal>
    </>
  );
}

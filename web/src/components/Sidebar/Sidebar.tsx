import {
  CalendarOutlined,
  HomeOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { ReactElement, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { authContext } from '../../store/auth';

const ResponsiveContainer = styled.div`
  width: 300px;
  @media (max-width: 950px) {
    display: none;
  }
`;

export default function Sidebar(): ReactElement {
  const { userType } = useContext(authContext);
  const location = useLocation();

  let menu;
  menu =
    userType === 'owner' ? (
      <Menu
        style={{ width: '100%' }}
        mode="inline"
        defaultSelectedKeys={['/']}
        selectedKeys={[location.pathname]}
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

  return <ResponsiveContainer>{menu}</ResponsiveContainer>;
}

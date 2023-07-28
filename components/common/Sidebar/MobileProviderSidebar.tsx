import { ArrowDown, Cross, Hamburger } from 'components/icons';
import Logout from 'components/icons/Logout';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'components/actions';

const MobileProviderSidebar = ({}) => {
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <SidebarWrapper>
      <button
        className="Toggleicon"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Hamburger />
      </button>
      <div className="Toggle">
        {showSidebar && (
          <div className="mobsidebar">
            <div className="context">
              <div className="header">
                <h2>Menu</h2>
                <Button
                  icon={<Cross fill="black" />}
                  iconOnly
                  onPress={() => setShowSidebar(!showSidebar)}
                >
                  close menu
                </Button>
              </div>
              <Link
                href={`/providers/${router.query.provider}/dashboard/dashboard`}
                passHref
              >
                <button>Dashboard</button>
              </Link>

              <button onClick={() => setShowDropdown(!showDropdown)}>
                Datasets <ArrowDown />
              </button>
              {showDropdown && (
                <div className="dropdown">
                  <Link
                    href={`/providers/${router.query.provider}/dashboard/datasets/drafts`}
                    passHref
                  >
                    <button className="active">Drafts</button>
                  </Link>

                  <button>Published</button>
                  <button>Archived</button>
                </div>
              )}
              <Link
                href={`/providers/${router.query.provider}/dashboard/organization-info`}
                passHref
              >
                <button>Organization Info</button>
              </Link>
              <Link
                href={`/providers/${router.query.provider}/dashboard/other-settings`}
                passHref
              >
                <button>Other Settings</button>
              </Link>
              <div>
                <div className="accountcrd">
                  <div className="crddata">
                    <Image
                      width={40}
                      height={20}
                      className="acc"
                      src="/assets/images/user.png"
                      alt="Profile icon of user"
                    />
                    <div className="info">
                      <h2 className="user">User/Org Name</h2>
                      <h2 className="type">Account Type</h2>
                    </div>

                    <Logout></Logout>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarWrapper>
  );
};

export default MobileProviderSidebar;

const SidebarWrapper = styled.div`
  .Toggle {
    display: none;
  }
  .Toggleicon {
    display: none;
  }
  @media (max-width: 920px) {
    .Toggleicon {
      display: block;
    }
    .header {
      display: flex;

      padding: 0 12px;
      justify-content: space-between;
    }
    .mobsidebar {
      background-color: white;
      width: 250px;
      min-width: 250px;
      z-index: 1;
      min-height: 100%;
      margin-top: -5rem;
      position: fixed;
      /* background-color: white;
    width: 250px;
    min-width: 250px;
    min-height: 1000px; */
    }

    .Toggle {
      /* display: block;
      position: absolute;
      background-color: white;
      z-index: 990; */

      display: block;
    }
    .context {
      display: grid;
      margin-top: 10px;
    }
    .context button {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-background-lightest);
      color: black;
      padding: 12px;
      border-radius: 0px;
      margin: 10px;
    }
    .context .dropdown button {
      width: -moz-available; /* WebKit-based browsers will ignore this. */
      width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
      margin-left: 40px;
    }
    .dropdown .active {
      background-color: var(--nav-bg);
      color: white;
      font-weight: 600;
    }
    .accountcrd {
      margin-left: 12px;
      margin-right: 12px;
      margin-bottom: 12px;
      margin-top: 12px;
      /* position: absolute;
    bottom: 0; */
      /* padding-top: 5px; */
      padding: 10px;
      background-color: var(--color-background-lightest);
      border-radius: 100px;

      .crddata {
        margin: auto;
        padding: 2px;
        display: flex;
        svg {
          margin: auto;
        }
      }
      .info {
        margin-right: auto;
        padding: 0 6px;
      }
      .user {
        font-size: 16px;
        font-weight: 700;
        color: #314795;
      }
      .type {
        font-size: 14px;
        font-weight: 400;
      }
      .acc {
        width: auto;
        margin: auto;
      }
    }
  }
`;

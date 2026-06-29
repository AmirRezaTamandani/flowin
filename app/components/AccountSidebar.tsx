"use client";

import { navItems, type NavItem } from "../lib/surveys";

type AccountSidebarProps = {
  activeSection: string;
  openSubmenu: string | null;
  onSectionChange: (id: string) => void;
  onSubmenuToggle: (id: string | null) => void;
};

const surveySections = new Set(["branding", "seo", "profile", "dashboard"]);

export default function AccountSidebar({
  activeSection,
  openSubmenu,
  onSectionChange,
  onSubmenuToggle,
}: AccountSidebarProps) {
  function handleItemClick(item: NavItem) {
    if (item.children) {
      onSubmenuToggle(openSubmenu === item.id ? null : item.id);
      return;
    }
    if (surveySections.has(item.id)) {
      onSectionChange(item.id);
    }
  }

  function handleChildClick(childId: string) {
    if (surveySections.has(childId)) {
      onSectionChange(childId);
    }
  }

  function isActive(item: NavItem): boolean {
    if (item.id === activeSection) return true;
    return item.children?.some((c) => c.id === activeSection) ?? false;
  }

  return (
    <aside className="account-sidebar" aria-label="حساب کاربری من">
      <div className="account-sidebar-title">حساب کاربری من</div>
      <nav className="account-sidebar-nav">
        {navItems.map((item) => (
          <div key={item.id} className="account-sidebar-group">
            {item.children ? (
              <>
                <button
                  type="button"
                  className={`account-sidebar-item account-sidebar-group-btn ${isActive(item) ? "active" : ""}`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.label}
                  <span
                    className={`account-chevron ${openSubmenu === item.id ? "open" : ""}`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
                {openSubmenu === item.id && (
                  <div className="account-submenu">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        className={`account-sidebar-item account-submenu-item ${activeSection === child.id ? "active" : ""}`}
                        onClick={() => handleChildClick(child.id)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                className={`account-sidebar-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

"use client";

import { navItems, surveyMap, type NavItem } from "../lib/surveys";

type AccountSidebarProps = {
  activeSection: string;
  openSubmenu: string | null;
  onSectionChange: (id: string) => void;
  onSubmenuToggle: (id: string | null) => void;
};

const availableSections = new Set(Object.keys(surveyMap));

function hasSurvey(id: string): boolean {
  return availableSections.has(id);
}

export default function AccountSidebar({
  activeSection,
  openSubmenu,
  onSectionChange,
  onSubmenuToggle,
}: AccountSidebarProps) {
  function handleItemClick(item: NavItem) {
    if (item.children) {
      const surveyChild = item.children.find((child) => hasSurvey(child.id));
      if (surveyChild) {
        onSectionChange(surveyChild.id);
        onSubmenuToggle(item.id);
        return;
      }
      onSubmenuToggle(openSubmenu === item.id ? null : item.id);
      return;
    }
    if (hasSurvey(item.id)) {
      onSectionChange(item.id);
    }
  }

  function handleChildClick(childId: string) {
    if (hasSurvey(childId)) {
      onSectionChange(childId);
    }
  }

  function isActive(item: NavItem): boolean {
    if (item.id === activeSection) return true;
    return item.children?.some((child) => child.id === activeSection) ?? false;
  }

  return (
    <aside className="account-sidebar" aria-label="حساب کاربری من">
      <div className="text-black account-sidebar-title">حساب کاربری من</div>
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
                        className={`account-sidebar-item account-submenu-item ${activeSection === child.id ? "active" : ""} ${!hasSurvey(child.id) ? "disabled" : ""}`}
                        onClick={() => handleChildClick(child.id)}
                        disabled={!hasSurvey(child.id)}
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

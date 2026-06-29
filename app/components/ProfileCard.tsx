"use client";
import React from "react";

export default function ProfileCard() {
  return (
    <aside className="profile-card" aria-label="profile card">
      <div className="profile-inner">
        <div className="avatar">A</div>
        <div className="profile-info">
          <h3 className="name">Amir Reza Tamandani</h3>
          <p className="phone">09107066626</p>
          <button className="edit-btn">ویرایش پروفایل</button>
        </div>
      </div>
    </aside>
  );
}

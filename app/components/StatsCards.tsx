import React from "react";

export default function StatsCards() {
  return (
    <section className="stats-cards">
      <div className="card">
        <div className="icon">📦</div>
        <div className="num">0 بار</div>
        <div className="label">تعداد سفارش های شما</div>
      </div>
      <div className="card">
        <div className="icon">💰</div>
        <div className="num">0 تومان</div>
        <div className="label">موجودی کیف پول شماست</div>
      </div>
      <div className="card">
        <div className="icon">📅</div>
        <div className="num">1 روز پیش</div>
        <div className="label">عضوی از ما شدی</div>
      </div>
    </section>
  );
}

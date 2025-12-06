import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/admin/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/admin/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/admin/ecommerce/MonthlySalesChart";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <EcommerceMetrics />

                <MonthlySalesChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
                <MonthlyTarget />
            </div>

         

           
        </div>
    );
}

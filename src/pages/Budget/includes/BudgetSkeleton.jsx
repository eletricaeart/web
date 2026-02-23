import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/layout/View";
import "../Budget.css"; // Reaproveita os espaçamentos originais

export default function BudgetSkeleton() {
  return (
    <View tag="budget-page" className="opacity-70">
      {/* Simulação do EACard */}
      <View tag="page-header">
        <Skeleton className="w-full aspect-[3.8/1] rounded-2xl mb-4" />
        {/* Simulação do doc-id */}
        <div className="flex justify-between w-[calc(100%-1rem)] p-2 bg-white rounded-b-2xl border-x-[5px] border-gray-100">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </View>

      {/* Simulação do doc-title */}
      <View tag="doc-title" className="mt-4">
        <div className="flex flex-col items-center py-4 w-full">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </View>

      {/* Simulação da cliente-section */}
      <View tag="cliente-section">
        <View tag="ui" className="w-full">
          <Skeleton className="h-10 w-full rounded-t-2xl" />
          <div className="p-4 bg-white">
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-5 w-full" />
          </div>
        </View>
      </View>

      {/* Simulação de Cláusulas (loop de 2 cláusulas) */}
      {[1, 2].map((i) => (
        <View key={i} tag="clause" className="mt-4">
          <View tag="ui">
            <Skeleton className="h-10 w-full" />
            <div className="p-4 bg-white">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </View>
        </View>
      ))}
    </View>
  );
}

'use client';

import { useState } from 'react';
import type { SavedBuyer } from '@/types/saved-buyer';
import {
  useUpdateSavedBuyer,
  useDeleteSavedBuyer,
} from '@/hooks/mutations/use-saved-buyer-mutations';

interface SavedBuyerManagerProps {
  savedBuyers: SavedBuyer[];
  onClose: () => void;
}

export default function SavedBuyerManager({
  savedBuyers,
  onClose,
}: SavedBuyerManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', address: '', contact: '' });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const updateBuyer = useUpdateSavedBuyer();
  const deleteBuyer = useDeleteSavedBuyer();

  const startEdit = (buyer: SavedBuyer) => {
    setEditingId(buyer.id);
    setEditForm({ name: buyer.name, address: buyer.address, contact: buyer.contact });
  };

  const handleSave = () => {
    if (!editingId || !editForm.name.trim()) return;
    updateBuyer.mutate(
      { id: editingId, ...editForm },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const handleDelete = (id: number) => {
    deleteBuyer.mutate(id, {
      onSuccess: () => setDeletingId(null),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-900">바이어 주소록 관리</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-96 overflow-auto p-5">
          {savedBuyers.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              저장된 바이어가 없습니다
            </p>
          ) : (
            <div className="space-y-3">
              {savedBuyers.map((buyer) => (
                <div
                  key={buyer.id}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  {editingId === buyer.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="이름/회사"
                      />
                      <input
                        type="text"
                        className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, address: e.target.value }))
                        }
                        placeholder="주소"
                      />
                      <input
                        type="text"
                        className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
                        value={editForm.contact}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, contact: e.target.value }))
                        }
                        placeholder="연락처"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded px-3 py-1 text-xs text-gray-500 hover:bg-gray-100"
                          onClick={() => setEditingId(null)}
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          className="rounded bg-gray-900 px-3 py-1 text-xs text-white hover:bg-gray-800 disabled:opacity-50"
                          onClick={handleSave}
                          disabled={updateBuyer.isPending}
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {buyer.name}
                        </div>
                        {buyer.address && (
                          <div className="mt-0.5 truncate text-xs text-gray-500">
                            {buyer.address}
                          </div>
                        )}
                        {buyer.contact && (
                          <div className="mt-0.5 text-xs text-gray-400">
                            {buyer.contact}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 flex shrink-0 gap-1">
                        {deletingId === buyer.id ? (
                          <>
                            <button
                              type="button"
                              className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(buyer.id)}
                              disabled={deleteBuyer.isPending}
                            >
                              삭제
                            </button>
                            <button
                              type="button"
                              className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                              onClick={() => setDeletingId(null)}
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              onClick={() => startEdit(buyer)}
                              title="수정"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                              onClick={() => setDeletingId(buyer.id)}
                              title="삭제"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

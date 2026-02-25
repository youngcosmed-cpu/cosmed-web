'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category } from '@/types/brand';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/queries/use-categories';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryModal({ open, onClose }: CategoryModalProps) {
  const { data } = useCategories();
  const categories = data?.data ?? [];

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [newName, setNewName] = useState('');
  const [newSortOrder, setNewSortOrder] = useState(0);

  const newNameRef = useRef<HTMLInputElement>(null);
  const editNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setNewName('');
      setNewSortOrder(0);
    }
  }, [open]);

  useEffect(() => {
    if (editingId !== null) {
      editNameRef.current?.focus();
    }
  }, [editingId]);

  if (!open) return null;

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createMutation.mutate(
      { name: trimmed, sortOrder: newSortOrder },
      {
        onSuccess: () => {
          setNewName('');
          setNewSortOrder(0);
          newNameRef.current?.focus();
        },
      },
    );
  };

  const handleUpdate = () => {
    if (editingId === null) return;
    const trimmed = editName.trim();
    if (!trimmed) return;
    updateMutation.mutate(
      { id: editingId, name: trimmed, sortOrder: editSortOrder },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;
    deleteMutation.mutate(id);
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSortOrder(cat.sortOrder);
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[520px] mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#E8E8E8]">
          <h2 className="font-display text-lg font-bold text-[#1A1A1A]">
            카테고리 관리
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#999] hover:bg-[#F0F0F0] hover:text-[#333] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-5">
          {/* Add new */}
          <div className="flex gap-2.5 mb-6">
            <input
              ref={newNameRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="새 카테고리 이름"
              className="flex-1 px-3.5 py-2.5 border border-[#DDD] rounded-lg font-body text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#BBB]"
            />
            <input
              type="number"
              value={newSortOrder}
              onChange={(e) => setNewSortOrder(Number(e.target.value))}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="순서"
              className="w-[72px] px-3 py-2.5 border border-[#DDD] rounded-lg font-body text-sm text-[#1A1A1A] text-center outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#BBB]"
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || isMutating}
              className="px-4 py-2.5 bg-[#1A1A1A] text-white rounded-lg font-body text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              추가
            </button>
          </div>

          {/* List */}
          <div className="flex flex-col gap-1">
            {categories.length === 0 && (
              <p className="text-center text-sm text-[#999] py-8">
                카테고리가 없습니다
              </p>
            )}
            {categories.map((cat) =>
              editingId === cat.id ? (
                <div
                  key={cat.id}
                  className="flex items-center gap-2.5 py-2.5 px-3 bg-[#F8F8F8] rounded-lg"
                >
                  <input
                    ref={editNameRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 px-3 py-2 border border-[#DDD] rounded-lg font-body text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                  <input
                    type="number"
                    value={editSortOrder}
                    onChange={(e) => setEditSortOrder(Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="w-[72px] px-3 py-2 border border-[#DDD] rounded-lg font-body text-sm text-[#1A1A1A] text-center outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                  <button
                    onClick={handleUpdate}
                    disabled={!editName.trim() || isMutating}
                    className="px-3 py-2 bg-[#1A1A1A] text-white rounded-lg font-body text-xs font-semibold hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-2 border border-[#DDD] rounded-lg font-body text-xs font-semibold text-[#666] hover:border-[#999] transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#F8F8F8] group transition-colors"
                >
                  <span className="flex-1 font-body text-sm text-[#1A1A1A]">
                    {cat.name}
                  </span>
                  <span className="font-body text-xs text-[#999] w-8 text-center">
                    {cat.sortOrder}
                  </span>
                  <button
                    onClick={() => startEditing(cat)}
                    className="px-2.5 py-1.5 rounded-md font-body text-xs text-[#666] opacity-0 group-hover:opacity-100 hover:bg-[#E8E8E8] transition-all cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={isMutating}
                    className="px-2.5 py-1.5 rounded-md font-body text-xs text-[#E53935] opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    삭제
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

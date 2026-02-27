'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Category } from '@/types/brand';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
} from '@/hooks/queries/use-categories';
import { useToast } from '@/hooks/use-toast';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
}

function DragHandle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-text-placeholder shrink-0"
    >
      <circle cx="5.5" cy="3" r="1.2" />
      <circle cx="10.5" cy="3" r="1.2" />
      <circle cx="5.5" cy="8" r="1.2" />
      <circle cx="10.5" cy="8" r="1.2" />
      <circle cx="5.5" cy="13" r="1.2" />
      <circle cx="10.5" cy="13" r="1.2" />
    </svg>
  );
}

interface SortableCategoryItemProps {
  cat: Category;
  isEditing: boolean;
  editName: string;
  isMutating: boolean;
  onEditNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartEditing: () => void;
  onDelete: () => void;
  editNameRef: React.RefObject<HTMLInputElement | null>;
}

function SortableCategoryItem({
  cat,
  isEditing,
  editName,
  isMutating,
  onEditNameChange,
  onSave,
  onCancel,
  onStartEditing,
  onDelete,
  editNameRef,
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2.5 py-2.5 px-3 bg-bg-admin rounded-lg"
      >
        <input
          ref={editNameRef}
          type="text"
          value={editName}
          onChange={(e) => onEditNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          className="flex-1 px-3 py-2 border border-border-strong rounded-lg font-body text-sm text-admin-dark outline-none focus:border-admin-dark transition-colors"
        />
        <button
          onClick={onSave}
          disabled={!editName.trim() || isMutating}
          className="px-3 py-2 bg-admin-dark text-white rounded-lg font-body text-xs font-semibold hover:bg-admin-dark-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isMutating ? '저장 중...' : '저장'}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 border border-border-strong rounded-lg font-body text-xs font-semibold text-text-label hover:border-text-placeholder transition-colors cursor-pointer"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-bg-admin group transition-colors ${isDragging ? 'opacity-50 bg-bg-admin shadow-sm' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none p-0.5 rounded hover:bg-border-light transition-colors"
      >
        <DragHandle />
      </button>
      <span className="flex-1 font-body text-sm text-admin-dark">
        {cat.name}
      </span>
      {(cat._count?.brands ?? 0) > 0 && (
        <span className="font-body text-xs text-text-placeholder">
          브랜드 {cat._count!.brands}
        </span>
      )}
      <button
        onClick={onStartEditing}
        className="px-2.5 py-1.5 rounded-md font-body text-xs text-text-label opacity-0 group-hover:opacity-100 hover:bg-border-light transition-all cursor-pointer"
      >
        수정
      </button>
      <button
        onClick={onDelete}
        disabled={isMutating || (cat._count?.brands ?? 0) > 0}
        className="px-2.5 py-1.5 rounded-md font-body text-xs text-error opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        삭제
      </button>
    </div>
  );
}

export function CategoryModal({ open, onClose }: CategoryModalProps) {
  const { data } = useCategories();
  const categories = data?.data ?? [];

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const reorderMutation = useReorderCategories();

  const toast = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');

  const newNameRef = useRef<HTMLInputElement>(null);
  const editNameRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setNewName('');
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
    const maxSort = categories.length > 0
      ? Math.max(...categories.map((c) => c.sortOrder))
      : -1;
    createMutation.mutate(
      { name: trimmed, sortOrder: maxSort + 1 },
      {
        onSuccess: () => {
          toast.success('카테고리가 추가되었습니다');
          setNewName('');
          newNameRef.current?.focus();
        },
        onError: () => toast.error('카테고리 추가에 실패했습니다'),
      },
    );
  };

  const handleUpdate = () => {
    if (editingId === null) return;
    const trimmed = editName.trim();
    if (!trimmed) return;
    updateMutation.mutate(
      { id: editingId, name: trimmed },
      {
        onSuccess: () => {
          toast.success('카테고리가 수정되었습니다');
          setEditingId(null);
        },
        onError: () => toast.error('카테고리 수정에 실패했습니다'),
      },
    );
  };

  const handleDelete = (cat: Category) => {
    const brandCount = cat._count?.brands ?? 0;
    if (brandCount > 0) {
      toast.error(`이 카테고리에 등록된 브랜드가 ${brandCount}개 있어 삭제할 수 없습니다`);
      return;
    }
    if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;
    deleteMutation.mutate(cat.id, {
      onSuccess: () => toast.success('카테고리가 삭제되었습니다'),
      onError: () => toast.error('카테고리 삭제에 실패했습니다'),
    });
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categories, oldIndex, newIndex);
    reorderMutation.mutate(reordered.map((c) => c.id));
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
        <div className="flex items-center justify-between px-7 py-5 border-b border-border-light">
          <h2 className="font-display text-lg font-bold text-admin-dark">
            카테고리 관리
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-placeholder hover:bg-bg-muted hover:text-admin-dark-hover transition-colors cursor-pointer"
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
              className="flex-1 px-3.5 py-2.5 border border-border-strong rounded-lg font-body text-sm text-admin-dark outline-none focus:border-admin-dark transition-colors placeholder:text-text-disabled"
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || isMutating}
              className="px-4 py-2.5 bg-admin-dark text-white rounded-lg font-body text-sm font-semibold hover:bg-admin-dark-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? '추가 중...' : '추가'}
            </button>
          </div>

          {/* List */}
          <div className="flex flex-col gap-1">
            {categories.length === 0 && (
              <p className="text-center text-sm text-text-placeholder py-8">
                카테고리가 없습니다
              </p>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((cat) => (
                  <SortableCategoryItem
                    key={cat.id}
                    cat={cat}
                    isEditing={editingId === cat.id}
                    editName={editName}
                    isMutating={isMutating}
                    onEditNameChange={setEditName}
                    onSave={handleUpdate}
                    onCancel={() => setEditingId(null)}
                    onStartEditing={() => startEditing(cat)}
                    onDelete={() => handleDelete(cat)}
                    editNameRef={editNameRef}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}

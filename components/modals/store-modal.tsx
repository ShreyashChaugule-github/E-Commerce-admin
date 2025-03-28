"use client"

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export const StoreModal = () => {
    const StoreModal = useStoreModal();

    return (
    <Modal 
        title="Create store"
        description="Add a new store to mange products and categories"
        isOpen={StoreModal.isOpen}
        onClose={StoreModal.onClose}
        >
        Future Create Store Form
    </Modal>
    );
};
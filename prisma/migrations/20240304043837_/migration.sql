-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `number_role` INTEGER NOT NULL,
    `disc_limit` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Custs` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NULL,
    `contact_phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `npwp` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `fincontact` VARCHAR(191) NULL,
    `fincontact_phone` VARCHAR(191) NULL,
    `img_logo` VARCHAR(191) NULL,
    `img_akta` VARCHAR(191) NULL,
    `img_nib` VARCHAR(191) NULL,
    `img_npwp` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `id_cust` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `Sales_type` VARCHAR(191) NULL,
    `camp_name` VARCHAR(191) NULL,
    `order_no` INTEGER NULL,
    `order_date` DATETIME(3) NULL,
    `period_start` DATETIME(3) NULL,
    `period_end` DATETIME(3) NULL,
    `pay_type` VARCHAR(191) NULL,
    `no_mo` VARCHAR(191) NULL,
    `media_tayang` VARCHAR(191) NULL,
    `rate_type` VARCHAR(191) NULL,
    `sales_approve` BOOLEAN NULL,
    `manager_approve` BOOLEAN NULL,
    `pic_approve` BOOLEAN NULL,
    `request_by` VARCHAR(191) NULL,
    `created_At` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_At` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mitra` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NULL,
    `is_deleted` BOOLEAN NULL,
    `created_At` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_At` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderMitra` (
    `idOrder` VARCHAR(191) NOT NULL,
    `idMitra` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idMitra`, `idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listProduk` (
    `id` VARCHAR(191) NOT NULL,
    `idOrder` VARCHAR(191) NULL,
    `produk` VARCHAR(191) NULL,
    `rate` VARCHAR(191) NULL,
    `kategori` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payCash` (
    `idOrder` VARCHAR(191) NOT NULL,
    `total` INTEGER NOT NULL,
    `tempo` DATETIME(3) NOT NULL,
    `diskon` DOUBLE NULL,
    `cash_back` DOUBLE NULL,
    `intensive` DOUBLE NULL,
    `finalPrice` INTEGER NULL,

    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payBarter` (
    `idOrder` VARCHAR(191) NOT NULL,
    `nilai` INTEGER NOT NULL,
    `barang` VARCHAR(191) NULL,
    `tempo` DATETIME(3) NULL,
    `diskon` DOUBLE NULL,
    `cash_back` DOUBLE NULL,
    `intensive` DOUBLE NULL,
    `finalPrice` INTEGER NULL,

    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paySemiBarter` (
    `idOrder` VARCHAR(191) NOT NULL,
    `nilaiBarter` INTEGER NOT NULL,
    `tempoBarter` DATETIME(3) NOT NULL,
    `nilaiCash` INTEGER NOT NULL,
    `tempoCash` DATETIME(3) NOT NULL,
    `itemBarang` VARCHAR(191) NOT NULL,
    `totalRate` INTEGER NOT NULL,
    `finalPrice` INTEGER NOT NULL,
    `diskon` DOUBLE NULL,
    `cash_back` DOUBLE NULL,
    `intensive` DOUBLE NULL,

    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payKredit` (
    `idOrder` VARCHAR(191) NOT NULL,
    `nilaiKredit` INTEGER NOT NULL,
    `tempo` DATETIME(3) NOT NULL,
    `diskon` DOUBLE NULL,
    `finalPrice` INTEGER NOT NULL,
    `cash_back` DOUBLE NULL,
    `intensive` DOUBLE NULL,

    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payTermin` (
    `idOrder` VARCHAR(191) NOT NULL,
    `termin_1` INTEGER NOT NULL,
    `tempo_1` DATETIME(3) NOT NULL,
    `termin_2` INTEGER NOT NULL,
    `tempo_2` DATETIME(3) NOT NULL,
    `termin_3` INTEGER NOT NULL,
    `tempo_3` DATETIME(3) NOT NULL,
    `diskon` DOUBLE NULL,
    `finalPrice` INTEGER NOT NULL,
    `cash_back` DOUBLE NULL,
    `intensive` DOUBLE NULL,

    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payDeposit` (
    `idOrder` VARCHAR(191) NOT NULL,
    `totalDeposit` INTEGER NOT NULL,
    `minDeposit` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `cash_back` DOUBLE NULL,
    `intensive` DOUBLE NULL,

    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderTayangIklan` (
    `id` VARCHAR(191) NOT NULL,
    `idOrder` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NULL,
    `sub` VARCHAR(191) NULL,
    `oti` VARCHAR(191) NULL,
    `tayang` BOOLEAN NULL,
    `bukti_tayang` VARCHAR(191) NULL,
    `orderDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_article` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `prmn` INTEGER NULL,
    `mitra` INTEGER NULL,
    `is_custom_price_prmn` BOOLEAN NULL,
    `is_custom_price_mitra` BOOLEAN NULL,
    `note` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_sosmed` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `instagram` INTEGER NULL,
    `facebook` INTEGER NULL,
    `rate` INTEGER NULL,
    `type` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `is_other` BOOLEAN NULL,
    `is_custom_price` BOOLEAN NULL,
    `is_deleted` BOOLEAN NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_other_content` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rate` INTEGER NULL,
    `note` VARCHAR(191) NULL,
    `is_custom_price` BOOLEAN NULL,
    `is_deleted` BOOLEAN NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_cpd` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `rate_home` INTEGER NULL,
    `rate_detail` INTEGER NULL,
    `rate_section` INTEGER NULL,
    `is_deleted` BOOLEAN NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_cpm` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `rate` INTEGER NULL,
    `is_deleted` BOOLEAN NULL,
    `is_custom_price` BOOLEAN NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_cust_fkey` FOREIGN KEY (`id_cust`) REFERENCES `Custs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderMitra` ADD CONSTRAINT `OrderMitra_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderMitra` ADD CONSTRAINT `OrderMitra_idMitra_fkey` FOREIGN KEY (`idMitra`) REFERENCES `Mitra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listProduk` ADD CONSTRAINT `listProduk_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payCash` ADD CONSTRAINT `payCash_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payBarter` ADD CONSTRAINT `payBarter_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paySemiBarter` ADD CONSTRAINT `paySemiBarter_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payKredit` ADD CONSTRAINT `payKredit_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payTermin` ADD CONSTRAINT `payTermin_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payDeposit` ADD CONSTRAINT `payDeposit_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderTayangIklan` ADD CONSTRAINT `OrderTayangIklan_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

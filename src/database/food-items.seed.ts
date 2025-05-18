import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodItem } from '../food-items/food-item.entity';

@Injectable()
export class FoodItemsSeeder {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  async seed() {
    console.log('🌱 Starting food items seeding...');

    const foodCategories = {
      proteins: [
        { name: 'Blanc de poulet', calories: 165, protein: 31, carbs: 0, fat: 3.6, quantity: 100, unit: 'g' },
        { name: 'Cuisse de poulet sans peau', calories: 209, protein: 26, carbs: 0, fat: 11, quantity: 100, unit: 'g' },
        { name: 'Dinde rôtie', calories: 189, protein: 29, carbs: 0, fat: 7.4, quantity: 100, unit: 'g' },
        { name: 'Bœuf haché 5%', calories: 137, protein: 25, carbs: 0, fat: 4, quantity: 100, unit: 'g' },
        { name: 'Bœuf filet', calories: 158, protein: 26, carbs: 0, fat: 5.5, quantity: 100, unit: 'g' },
        { name: 'Porc filet', calories: 143, protein: 26, carbs: 0, fat: 3.6, quantity: 100, unit: 'g' },
        { name: 'Jambon blanc dégraissé', calories: 115, protein: 21, carbs: 1.4, fat: 2.6, quantity: 100, unit: 'g' },
        { name: 'Saumon atlantique', calories: 208, protein: 22, carbs: 0, fat: 13, quantity: 100, unit: 'g' },
        { name: 'Saumon fumé', calories: 117, protein: 25, carbs: 0, fat: 2.8, quantity: 100, unit: 'g' },
        { name: 'Thon en conserve au naturel', calories: 116, protein: 26, carbs: 0, fat: 1, quantity: 100, unit: 'g' },
        { name: 'Sardines en conserve', calories: 208, protein: 25, carbs: 0, fat: 11, quantity: 100, unit: 'g' },
        { name: 'Cabillaud', calories: 82, protein: 18, carbs: 0, fat: 0.7, quantity: 100, unit: 'g' },
        { name: 'Crevettes cuites', calories: 84, protein: 18, carbs: 0, fat: 1.1, quantity: 100, unit: 'g' },
        { name: 'Œuf entier', calories: 155, protein: 13, carbs: 1.1, fat: 11, quantity: 100, unit: 'g' },
        { name: 'Blanc d\'œuf', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Tofu ferme', calories: 144, protein: 15, carbs: 2.3, fat: 8.7, quantity: 100, unit: 'g' },
        { name: 'Tempeh', calories: 193, protein: 19, carbs: 9, fat: 11, quantity: 100, unit: 'g' },
      ],
      
      dairy: [
        { name: 'Yaourt grec nature 0%', calories: 59, protein: 10, carbs: 4, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Yaourt grec nature 2%', calories: 97, protein: 9, carbs: 4, fat: 5, quantity: 100, unit: 'g' },
        { name: 'Fromage blanc 0%', calories: 45, protein: 8, carbs: 4, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Fromage blanc 20%', calories: 101, protein: 8, carbs: 4.5, fat: 6, quantity: 100, unit: 'g' },
        { name: 'Cottage cheese', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, quantity: 100, unit: 'g' },
        { name: 'Mozzarella light', calories: 254, protein: 24, carbs: 3.1, fat: 16, quantity: 100, unit: 'g' },
        { name: 'Ricotta', calories: 174, protein: 11, carbs: 3, fat: 13, quantity: 100, unit: 'g' },
        { name: 'Parmesan râpé', calories: 392, protein: 36, carbs: 4, fat: 26, quantity: 100, unit: 'g' },
        { name: 'Lait écrémé', calories: 35, protein: 3.4, carbs: 5, fat: 0.1, quantity: 100, unit: 'ml' },
        { name: 'Lait demi-écrémé', calories: 47, protein: 3.2, carbs: 4.8, fat: 1.6, quantity: 100, unit: 'ml' },
        { name: 'Lait entier', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, quantity: 100, unit: 'ml' },
        { name: 'Lait d\'amande non sucré', calories: 17, protein: 0.6, carbs: 0.3, fat: 1.5, quantity: 100, unit: 'ml' },
      ],
      
      carbs: [
        { name: 'Riz blanc cuit', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Riz brun cuit', calories: 123, protein: 2.6, carbs: 23, fat: 0.9, quantity: 100, unit: 'g' },
        { name: 'Riz basmati cuit', calories: 121, protein: 2.5, carbs: 25, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Quinoa cuit', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, quantity: 100, unit: 'g' },
        { name: 'Boulgour cuit', calories: 83, protein: 3, carbs: 19, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Avoine flocons', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, quantity: 100, unit: 'g' },
        { name: 'Muesli sans sucre', calories: 367, protein: 13, carbs: 56, fat: 9.3, quantity: 100, unit: 'g' },
        { name: 'Pain complet', calories: 247, protein: 13, carbs: 41, fat: 4.2, quantity: 100, unit: 'g' },
        { name: 'Pain de mie complet', calories: 259, protein: 9, carbs: 45, fat: 4.8, quantity: 100, unit: 'g' },
        { name: 'Biscottes complètes', calories: 407, protein: 12, carbs: 71, fat: 8.1, quantity: 100, unit: 'g' },
        { name: 'Pâtes complètes cuites', calories: 124, protein: 5, carbs: 25, fat: 1.1, quantity: 100, unit: 'g' },
        { name: 'Pâtes blanches cuites', calories: 131, protein: 5, carbs: 25, fat: 1.1, quantity: 100, unit: 'g' },
        { name: 'Couscous cuit', calories: 112, protein: 3.8, carbs: 23, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Polenta', calories: 85, protein: 2, carbs: 18, fat: 0.6, quantity: 100, unit: 'g' },
        { name: 'Pomme de terre cuite', calories: 77, protein: 2, carbs: 17, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Patate douce cuite', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, quantity: 100, unit: 'g' },
      ],
      
      legumes: [
        { name: 'Lentilles vertes cuites', calories: 116, protein: 9, carbs: 20, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Lentilles corail cuites', calories: 100, protein: 7.6, carbs: 17, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Haricots rouges cuits', calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, quantity: 100, unit: 'g' },
        { name: 'Haricots blancs cuits', calories: 139, protein: 9.7, carbs: 25, fat: 0.5, quantity: 100, unit: 'g' },
        { name: 'Pois chiches cuits', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, quantity: 100, unit: 'g' },
        { name: 'Pois cassés cuits', calories: 99, protein: 6.9, carbs: 17, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Fèves cuites', calories: 88, protein: 7.6, carbs: 12, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Haricots verts', calories: 31, protein: 1.8, carbs: 7, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Petits pois', calories: 81, protein: 5.4, carbs: 14, fat: 0.4, quantity: 100, unit: 'g' },
      ],
      
      vegetables: [
        { name: 'Brocolis', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Chou-fleur', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Épinards frais', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Épinards surgelés', calories: 21, protein: 2.2, carbs: 3.8, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Courgettes', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Aubergines', calories: 25, protein: 1, carbs: 6, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Tomates fraîches', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Tomates cerises', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Concombre', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Carottes', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Poivrons rouges', calories: 31, protein: 1, carbs: 6, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Poivrons verts', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Champignons de Paris', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Champignons shiitake', calories: 34, protein: 2.2, carbs: 6.8, fat: 0.5, quantity: 100, unit: 'g' },
        { name: 'Oignons', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Ail', calories: 149, protein: 6.4, carbs: 33, fat: 0.5, quantity: 100, unit: 'g' },
        { name: 'Salade verte', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Roquette', calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, quantity: 100, unit: 'g' },
        { name: 'Chou rouge', calories: 31, protein: 1.4, carbs: 7.4, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Radis', calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Céleri branche', calories: 16, protein: 0.7, carbs: 3, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Asperges', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Artichaut', calories: 47, protein: 3.3, carbs: 10, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Betterave rouge', calories: 43, protein: 1.6, carbs: 10, fat: 0.2, quantity: 100, unit: 'g' },
      ],
      
      fruits: [
        { name: 'Pomme avec peau', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Pomme sans peau', calories: 53, protein: 0.3, carbs: 14, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Banane', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Mandarine', calories: 53, protein: 0.8, carbs: 13, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Pamplemousse', calories: 42, protein: 0.8, carbs: 11, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Citron', calories: 29, protein: 1.1, carbs: 9, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Kiwi', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, quantity: 100, unit: 'g' },
        { name: 'Fraises', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Framboises', calories: 52, protein: 1.2, carbs: 12, fat: 0.7, quantity: 100, unit: 'g' },
        { name: 'Myrtilles', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Mûres', calories: 43, protein: 1.4, carbs: 9.6, fat: 0.5, quantity: 100, unit: 'g' },
        { name: 'Raisin blanc', calories: 69, protein: 0.7, carbs: 16, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Raisin noir', calories: 69, protein: 0.7, carbs: 16, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Poire', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Pêche', calories: 39, protein: 0.9, carbs: 10, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Abricot', calories: 48, protein: 1.4, carbs: 11, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Prune', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, quantity: 100, unit: 'g' },
        { name: 'Cerise', calories: 63, protein: 1, carbs: 16, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Ananas', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Mangue', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, quantity: 100, unit: 'g' },
        { name: 'Avocat', calories: 160, protein: 2, carbs: 9, fat: 15, quantity: 100, unit: 'g' },
        { name: 'Melon', calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, quantity: 100, unit: 'g' },
        { name: 'Pastèque', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, quantity: 100, unit: 'g' },
      ],
      
      nuts_seeds: [
        { name: 'Amandes', calories: 579, protein: 21, carbs: 22, fat: 50, quantity: 100, unit: 'g' },
        { name: 'Noix', calories: 618, protein: 15, carbs: 14, fat: 59, quantity: 100, unit: 'g' },
        { name: 'Noisettes', calories: 628, protein: 15, carbs: 17, fat: 61, quantity: 100, unit: 'g' },
        { name: 'Pistaches', calories: 560, protein: 20, carbs: 28, fat: 45, quantity: 100, unit: 'g' },
        { name: 'Noix de cajou', calories: 553, protein: 18, carbs: 30, fat: 44, quantity: 100, unit: 'g' },
        { name: 'Noix du Brésil', calories: 659, protein: 14, carbs: 12, fat: 66, quantity: 100, unit: 'g' },
        { name: 'Cacahuètes', calories: 567, protein: 26, carbs: 16, fat: 49, quantity: 100, unit: 'g' },
        { name: 'Graines de tournesol', calories: 584, protein: 21, carbs: 20, fat: 51, quantity: 100, unit: 'g' },
        { name: 'Graines de lin', calories: 534, protein: 18, carbs: 29, fat: 42, quantity: 100, unit: 'g' },
        { name: 'Graines de chia', calories: 486, protein: 17, carbs: 42, fat: 31, quantity: 100, unit: 'g' },
        { name: 'Graines de courge', calories: 559, protein: 30, carbs: 11, fat: 49, quantity: 100, unit: 'g' },
        { name: 'Graines de sésame', calories: 573, protein: 18, carbs: 23, fat: 50, quantity: 100, unit: 'g' },
      ],
      
      oils_fats: [
        { name: 'Huile d\'olive extra vierge', calories: 884, protein: 0, carbs: 0, fat: 100, quantity: 100, unit: 'ml' },
        { name: 'Huile de colza', calories: 884, protein: 0, carbs: 0, fat: 100, quantity: 100, unit: 'ml' },
        { name: 'Huile de tournesol', calories: 884, protein: 0, carbs: 0, fat: 100, quantity: 100, unit: 'ml' },
        { name: 'Huile de coco', calories: 862, protein: 0, carbs: 0, fat: 100, quantity: 100, unit: 'ml' },
        { name: 'Beurre doux', calories: 717, protein: 0.9, carbs: 0.7, fat: 81, quantity: 100, unit: 'g' },
        { name: 'Beurre allégé 41%', calories: 371, protein: 0.7, carbs: 1, fat: 41, quantity: 100, unit: 'g' },
        { name: 'Margarine', calories: 717, protein: 0.2, carbs: 0.4, fat: 80, quantity: 100, unit: 'g' },
        { name: 'Crème fraîche épaisse 30%', calories: 292, protein: 2.4, carbs: 3, fat: 30, quantity: 100, unit: 'g' },
        { name: 'Crème fraîche légère 15%', calories: 169, protein: 3, carbs: 4, fat: 15, quantity: 100, unit: 'g' },
      ],
      
      condiments: [
        { name: 'Moutarde de Dijon', calories: 66, protein: 4.4, carbs: 5.6, fat: 3.4, quantity: 100, unit: 'g' },
        { name: 'Ketchup', calories: 112, protein: 1.1, carbs: 27, fat: 0.1, quantity: 100, unit: 'g' },
        { name: 'Mayonnaise', calories: 680, protein: 1.1, carbs: 0.6, fat: 75, quantity: 100, unit: 'g' },
        { name: 'Mayonnaise allégée', calories: 232, protein: 1, carbs: 8, fat: 22, quantity: 100, unit: 'g' },
        { name: 'Vinaigre balsamique', calories: 88, protein: 0.5, carbs: 17, fat: 0, quantity: 100, unit: 'ml' },
        { name: 'Sauce soja', calories: 8, protein: 1.3, carbs: 0.8, fat: 0, quantity: 100, unit: 'ml' },
        { name: 'Harissa', calories: 70, protein: 3, carbs: 12, fat: 2, quantity: 100, unit: 'g' },
        { name: 'Pesto basil', calories: 263, protein: 5.1, carbs: 5.1, fat: 25, quantity: 100, unit: 'g' },
      ],
      
      beverages: [
        { name: 'Eau plate', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 100, unit: 'ml' },
        { name: 'Eau gazeuse', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 100, unit: 'ml' },
        { name: 'Thé vert sans sucre', calories: 1, protein: 0, carbs: 0.2, fat: 0, quantity: 100, unit: 'ml' },
        { name: 'Café noir sans sucre', calories: 2, protein: 0.3, carbs: 0, fat: 0, quantity: 100, unit: 'ml' },
        { name: 'Jus d\'orange 100% pur', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, quantity: 100, unit: 'ml' },
        { name: 'Jus de pomme 100% pur', calories: 46, protein: 0.1, carbs: 11, fat: 0.1, quantity: 100, unit: 'ml' },
        { name: 'Coca-Cola', calories: 42, protein: 0, carbs: 10.6, fat: 0, quantity: 100, unit: 'ml' },
        { name: 'Coca-Cola Zéro', calories: 0.3, protein: 0, carbs: 0.05, fat: 0, quantity: 100, unit: 'ml' },
      ]
    };

    let totalAdded = 0;
    let totalSkipped = 0;

    for (const [category, foods] of Object.entries(foodCategories)) {
      console.log(`\n📂 Processing category: ${category.toUpperCase()}`);
      
      for (const food of foods) {
        const exists = await this.foodItemRepository.findOne({
          where: { name: food.name }
        });

        if (!exists) {
          await this.foodItemRepository.save(food);
          console.log(`  ✅ Added: ${food.name}`);
          totalAdded++;
        } else {
          console.log(`  ⏭️  Already exists: ${food.name}`);
          totalSkipped++;
        }
      }
    }

    console.log('\n🎉 Food items seeding completed!');
    console.log(`📊 Summary: ${totalAdded} items added, ${totalSkipped} items skipped`);
    console.log(`📈 Total available food items: ${totalAdded + totalSkipped}`);
  }
}
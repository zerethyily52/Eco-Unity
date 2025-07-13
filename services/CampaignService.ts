export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: { uri: string };
  details: string;
  steps: string[];
  benefits: string[];
  stats: {
    participants: number;
    treesPlanted?: number;
    trashCollected?: number;
    milesWalked?: number;
    studentsImpacted?: number;
    schoolsReached?: number;
    beachesClean?: number;
    co2Saved?: number;
    areas?: number;
  };
  duration: string;
  difficulty: 'Easy' | 'Beginner' | 'Intermediate' | 'Advanced';
  location: string;
  category: 'tree-planting' | 'cleanup' | 'education' | 'transport' | 'energy' | 'water' | 'waste' | 'wildlife';
}

class CampaignService {
  private campaigns: Campaign[] = [];

  constructor() {
    this.generateCampaigns();
  }

  // Функция для рандомизации числа в пределах процента
  private randomizeNumber(baseNumber: number, variationPercent: number): number {
    const variation = Math.random() * variationPercent * 2 - variationPercent;
    return Math.round(baseNumber * (1 + variation / 100));
  }

  // Случайный выбор элемента из массива
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Уникальные изображения для каждой кампании
  private getUniqueImage(category: string, index: number): { uri: string } {
    const images: Record<string, string[]> = {
      'tree-planting': [
        // Проверенные URL для tree planting
        'https://images.unsplash.com/photo-1591255199673-4e2b706645a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJlZSUyMHBsYW50aW5nfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1625179893310-8e419f979608?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1531818824911-2514c27dced3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHJlZSUyMHBsYW50aW5nfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1524602585632-a2a01c12307c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1637531347055-4fa8aa80c111?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1584970184010-5d2fd31691ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1645994079236-0445e3e4902d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1654089669464-dcc57c490d2b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1568950536205-011800762b66?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/reserve/bOvf94dPRxWu0u3QsPjF_tree.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1584324127278-b0ad4aba28b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1617091655496-7dfc8e2087df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1610546592318-5411185ebad8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODZ8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1709216074614-6e2cb2e13785?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fHRyZWUlMjBwbGFudGluZ3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1611568919785-ce37a2584691?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE5fHx0cmVlJTIwcGxhbnRpbmd8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1649700707494-176f755eda68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHx0cmVlJTIwcGxhbnRpbmd8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9yZXN0fGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9yZXN0fGVufDB8fDB8fHww'
      ],
      'cleanup': [
        // Проверенные URL для cleanup (trash)
        'https://images.unsplash.com/photo-1495556650867-99590cea3657?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhc2h8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1606901302392-ca613ab6abb7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHJhc2h8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1617303331806-3d6b58e03241?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1721622248593-c24c83b830c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/flagged/photo-1572213426852-0e4ed8f41ff6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1588106329001-2362b7d964ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1628171577082-2c1db571c9c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1592890278983-18616401d4ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1621408422423-4392b2711f69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1664783366257-ed2a579eea86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1551726275-c4495b31dbdc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHRyYXNofGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1633412954800-b2a39586e3b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHRyYXNofGVufDB8fDB8fHww'
      ],
      'education': [
        // Проверенные URL для education
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RWR1Y2F0aW9ufGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RWR1Y2F0aW9ufGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RWR1Y2F0aW9ufGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RWR1Y2F0aW9ufGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RWR1Y2F0aW9ufGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fEVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fEVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fEVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
      ],
      'transport': [
        // Проверенные URL для eco transport
        'https://images.unsplash.com/photo-1657417042847-ca485c43afbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWNvJTIwVHJhbnNwb3J0fGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1675733783453-3f1563ec0af8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZWNvJTIwVHJhbnNwb3J0fGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1750515137962-7e0c68047ddf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1593018931432-21feca0458c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1751654554710-80a7276a419e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1737530340340-676a8f0045e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1736069115866-c9f4c9b91a78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1655793620025-d9559f7dc713?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1646318777393-4b1c95dd3b96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1669360109634-8386c704a506?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTV8fGVjbyUyMFRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D'
      ],
      'energy': [
        // Проверенные URL для energy
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RW5lcmd5fGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RW5lcmd5fGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RW5lcmd5fGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEVuZXJneXxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1487875961445-47a00398c267?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEVuZXJneXxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEVuZXJneXxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1413882353314-73389f63b6fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEVuZXJneXxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1463173904305-ba479d2123b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fEVuZXJneXxlbnwwfHwwfHx8MA%3D%3D'
      ],
      'water': [
        // User-provided water images
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8V2F0ZXJ8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFdhdGVyfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1464925257126-6450e871c667?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fFdhdGVyfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fFdhdGVyfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1436968188282-5dc61aae3d81?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fFdhdGVyfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1457195740896-7f345efef228?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fFdhdGVyfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1483691278019-cb7253bee49f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fFdhdGVyfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fFdhdGVyfGVufDB8fDB8fHww'
      ],
      'waste': [
        // User-provided waste/plastic images
        'https://images.unsplash.com/photo-1571727153934-b9e0059b7ab2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGxhc3RpY3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGxhc3RpY3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1576037728058-ab2c538ac8d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGxhc3RpY3xlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1721622248657-55b1c5ec1dbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1606901302392-ca613ab6abb7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1536683650733-795c018f043a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1558640476-437a2b9438a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1537084642907-629340c7e59c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1637251393207-6c870eaca402?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHBsYXN0aWN8ZW58MHx8MHx8fDA%3D'
      ],
      'wildlife': [
        // User-provided wildlife/animal images
        'https://images.unsplash.com/photo-1598755257130-c2aaca1f061c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lsZCUyMGFuaW1hbHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1528652899333-492965af4854?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2lsZCUyMGFuaW1hbHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2lsZCUyMGFuaW1hbHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1464157571418-57e5ec30397b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2lsZCUyMGFuaW1hbHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1503308823166-13ce184e3007?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1504606113174-13136bc166ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1532517308734-0565178471d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1442522772768-9032b6d10e3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1598755257428-e7533d2f8771?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1552410260-0fd9b577afa6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1465471765877-2e7a264830d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1621362569445-1d371f5bbe76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1553284965-5dd8352ff1bd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1456392166678-2fe48a78cd12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHdpbGQlMjBhbmltYWx8ZW58MHx8MHx8fDA%3D'
      ]
    };

    const categoryImages = images[category] || images['tree-planting'];
    
    // Возвращаем изображение по индексу, если индекс превышает количество изображений,
    // используем остаток от деления для циклического прохода по массиву
    return { uri: categoryImages[index % categoryImages.length] };
  }

  // Генерация кампаний
  private generateCampaigns(): void {
    const campaignData = [
      // Tree planting campaigns
      { title: 'Urban Forest Project', category: 'tree-planting', baseStats: { participants: 1250, treesPlanted: 3400, areas: 15 }, duration: '6 months', difficulty: 'Beginner' },
      { title: 'Tree Planting Initiative', category: 'tree-planting', baseStats: { participants: 980, treesPlanted: 2800, areas: 12 }, duration: '4 months', difficulty: 'Easy' },
      { title: 'Green City Program', category: 'tree-planting', baseStats: { participants: 1500, treesPlanted: 4200, areas: 18 }, duration: '1 year', difficulty: 'Intermediate' },
      { title: 'Forest Restoration', category: 'tree-planting', baseStats: { participants: 750, treesPlanted: 2100, areas: 8 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Community Tree Care', category: 'tree-planting', baseStats: { participants: 1100, treesPlanted: 3100, areas: 14 }, duration: '6 months', difficulty: 'Easy' },
      { title: 'Reforestation Drive', category: 'tree-planting', baseStats: { participants: 850, treesPlanted: 2500, areas: 10 }, duration: '4 months', difficulty: 'Intermediate' },
      { title: 'Neighborhood Greening', category: 'tree-planting', baseStats: { participants: 900, treesPlanted: 2700, areas: 11 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Trees for Tomorrow', category: 'tree-planting', baseStats: { participants: 1200, treesPlanted: 3600, areas: 16 }, duration: '6 months', difficulty: 'Easy' },
      { title: 'Plant a Tree Today', category: 'tree-planting', baseStats: { participants: 650, treesPlanted: 1800, areas: 7 }, duration: '2 months', difficulty: 'Beginner' },
      { title: 'Green Streets Project', category: 'tree-planting', baseStats: { participants: 1300, treesPlanted: 3800, areas: 17 }, duration: '8 months', difficulty: 'Intermediate' },
      { title: 'Forest Revival', category: 'tree-planting', baseStats: { participants: 720, treesPlanted: 2000, areas: 9 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Tree Guardians', category: 'tree-planting', baseStats: { participants: 1000, treesPlanted: 2900, areas: 13 }, duration: '5 months', difficulty: 'Easy' },
      { title: 'Eco Forest Initiative', category: 'tree-planting', baseStats: { participants: 950, treesPlanted: 2600, areas: 12 }, duration: '4 months', difficulty: 'Intermediate' },
      { title: 'Growing Green', category: 'tree-planting', baseStats: { participants: 800, treesPlanted: 2200, areas: 9 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Tree Life Program', category: 'tree-planting', baseStats: { participants: 1150, treesPlanted: 3200, areas: 15 }, duration: '6 months', difficulty: 'Easy' },
      { title: 'Nature Canopy', category: 'tree-planting', baseStats: { participants: 880, treesPlanted: 2400, areas: 10 }, duration: '4 months', difficulty: 'Intermediate' },
      { title: 'Shade Tree Project', category: 'tree-planting', baseStats: { participants: 1050, treesPlanted: 3000, areas: 14 }, duration: '5 months', difficulty: 'Beginner' },
      { title: 'Future Forest', category: 'tree-planting', baseStats: { participants: 920, treesPlanted: 2650, areas: 11 }, duration: '4 months', difficulty: 'Easy' },
      { title: 'Tree Planting Marathon', category: 'tree-planting', baseStats: { participants: 1400, treesPlanted: 4000, areas: 19 }, duration: '1 year', difficulty: 'Intermediate' },
      { title: 'Green Spaces Expansion', category: 'tree-planting', baseStats: { participants: 1250, treesPlanted: 3500, areas: 16 }, duration: '7 months', difficulty: 'Beginner' },

      // Cleanup campaigns
      { title: 'Clean River Initiative', category: 'cleanup', baseStats: { participants: 650, trashCollected: 2800, beachesClean: 8 }, duration: 'Monthly events', difficulty: 'Beginner' },
      { title: 'Beach Cleanup Drive', category: 'cleanup', baseStats: { participants: 550, trashCollected: 2400, beachesClean: 6 }, duration: '2 weeks', difficulty: 'Easy' },
      { title: 'Park Restoration', category: 'cleanup', baseStats: { participants: 480, trashCollected: 2100, beachesClean: 5 }, duration: '1 month', difficulty: 'Beginner' },
      { title: 'Trash-Free Streets', category: 'cleanup', baseStats: { participants: 720, trashCollected: 3200, beachesClean: 9 }, duration: '3 months', difficulty: 'Easy' },
      { title: 'Community Cleanup', category: 'cleanup', baseStats: { participants: 600, trashCollected: 2600, beachesClean: 7 }, duration: '2 months', difficulty: 'Beginner' },
      { title: 'Ocean Rescue', category: 'cleanup', baseStats: { participants: 780, trashCollected: 3500, beachesClean: 10 }, duration: '4 months', difficulty: 'Intermediate' },
      { title: 'Lake Cleanup Project', category: 'cleanup', baseStats: { participants: 520, trashCollected: 2300, beachesClean: 6 }, duration: '1 month', difficulty: 'Easy' },
      { title: 'City Beautification', category: 'cleanup', baseStats: { participants: 850, trashCollected: 3800, beachesClean: 11 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Clean Environment', category: 'cleanup', baseStats: { participants: 640, trashCollected: 2900, beachesClean: 8 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Waste-Free Zones', category: 'cleanup', baseStats: { participants: 700, trashCollected: 3100, beachesClean: 9 }, duration: '4 months', difficulty: 'Easy' },
      { title: 'Riverside Cleanup', category: 'cleanup', baseStats: { participants: 580, trashCollected: 2500, beachesClean: 7 }, duration: '2 months', difficulty: 'Beginner' },
      { title: 'Beach Patrol', category: 'cleanup', baseStats: { participants: 620, trashCollected: 2700, beachesClean: 8 }, duration: '3 months', difficulty: 'Easy' },
      { title: 'Park Guardians', category: 'cleanup', baseStats: { participants: 560, trashCollected: 2400, beachesClean: 6 }, duration: '2 months', difficulty: 'Beginner' },
      { title: 'Street Heroes', category: 'cleanup', baseStats: { participants: 750, trashCollected: 3300, beachesClean: 10 }, duration: '5 months', difficulty: 'Intermediate' },
      { title: 'Clean Water Campaign', category: 'cleanup', baseStats: { participants: 680, trashCollected: 3000, beachesClean: 9 }, duration: '3 months', difficulty: 'Easy' },

      // Education campaigns
      { title: 'Eco School Program', category: 'education', baseStats: { participants: 890, studentsImpacted: 12000, schoolsReached: 45 }, duration: '1 school year', difficulty: 'Intermediate' },
      { title: 'Green Education Initiative', category: 'education', baseStats: { participants: 650, studentsImpacted: 8500, schoolsReached: 32 }, duration: '6 months', difficulty: 'Beginner' },
      { title: 'Environmental Awareness', category: 'education', baseStats: { participants: 750, studentsImpacted: 10000, schoolsReached: 38 }, duration: '8 months', difficulty: 'Easy' },
      { title: 'Kids Go Green', category: 'education', baseStats: { participants: 520, studentsImpacted: 7000, schoolsReached: 25 }, duration: '4 months', difficulty: 'Beginner' },
      { title: 'Sustainable Learning', category: 'education', baseStats: { participants: 680, studentsImpacted: 9200, schoolsReached: 35 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Nature Education', category: 'education', baseStats: { participants: 580, studentsImpacted: 7800, schoolsReached: 28 }, duration: '5 months', difficulty: 'Easy' },
      { title: 'Climate Action Learning', category: 'education', baseStats: { participants: 720, studentsImpacted: 9800, schoolsReached: 37 }, duration: '7 months', difficulty: 'Intermediate' },
      { title: 'Green Future Program', category: 'education', baseStats: { participants: 600, studentsImpacted: 8200, schoolsReached: 30 }, duration: '6 months', difficulty: 'Beginner' },
      { title: 'Eco Warriors', category: 'education', baseStats: { participants: 780, studentsImpacted: 10500, schoolsReached: 40 }, duration: '9 months', difficulty: 'Advanced' },
      { title: 'Environmental Champions', category: 'education', baseStats: { participants: 640, studentsImpacted: 8800, schoolsReached: 33 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Green Knowledge', category: 'education', baseStats: { participants: 560, studentsImpacted: 7500, schoolsReached: 27 }, duration: '5 months', difficulty: 'Easy' },
      { title: 'Earth Guardians', category: 'education', baseStats: { participants: 820, studentsImpacted: 11000, schoolsReached: 42 }, duration: '10 months', difficulty: 'Advanced' },

      // Transport campaigns
      { title: 'Green Transport Week', category: 'transport', baseStats: { participants: 2100, milesWalked: 15600, co2Saved: 4200 }, duration: '1 week', difficulty: 'Easy' },
      { title: 'Bike to Work', category: 'transport', baseStats: { participants: 1800, milesWalked: 13200, co2Saved: 3600 }, duration: '2 weeks', difficulty: 'Beginner' },
      { title: 'Car-Free Days', category: 'transport', baseStats: { participants: 1500, milesWalked: 11000, co2Saved: 3000 }, duration: '3 days', difficulty: 'Easy' },
      { title: 'Public Transit Challenge', category: 'transport', baseStats: { participants: 1650, milesWalked: 12200, co2Saved: 3300 }, duration: '1 month', difficulty: 'Beginner' },
      { title: 'Walk for Climate', category: 'transport', baseStats: { participants: 1900, milesWalked: 14000, co2Saved: 3800 }, duration: '2 weeks', difficulty: 'Easy' },
      { title: 'Cycle City', category: 'transport', baseStats: { participants: 1750, milesWalked: 12800, co2Saved: 3500 }, duration: '3 weeks', difficulty: 'Beginner' },
      { title: 'Sustainable Commute', category: 'transport', baseStats: { participants: 2000, milesWalked: 14800, co2Saved: 4000 }, duration: '1 month', difficulty: 'Easy' },
      { title: 'Green Travel', category: 'transport', baseStats: { participants: 1600, milesWalked: 11800, co2Saved: 3200 }, duration: '2 weeks', difficulty: 'Beginner' },
      { title: 'Eco Transport', category: 'transport', baseStats: { participants: 1850, milesWalked: 13600, co2Saved: 3700 }, duration: '3 weeks', difficulty: 'Easy' },
      { title: 'Carbon-Free Commute', category: 'transport', baseStats: { participants: 1700, milesWalked: 12500, co2Saved: 3400 }, duration: '1 month', difficulty: 'Beginner' },

      // Energy campaigns
      { title: 'Solar Power Initiative', category: 'energy', baseStats: { participants: 1800, co2Saved: 5600, areas: 25 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Energy Saving Challenge', category: 'energy', baseStats: { participants: 1500, co2Saved: 4800, areas: 20 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Renewable Energy', category: 'energy', baseStats: { participants: 1200, co2Saved: 3800, areas: 18 }, duration: '1 year', difficulty: 'Advanced' },
      { title: 'Green Energy Program', category: 'energy', baseStats: { participants: 1650, co2Saved: 5200, areas: 22 }, duration: '8 months', difficulty: 'Intermediate' },
      { title: 'Power Conservation', category: 'energy', baseStats: { participants: 1400, co2Saved: 4400, areas: 19 }, duration: '4 months', difficulty: 'Easy' },
      { title: 'Clean Energy', category: 'energy', baseStats: { participants: 1750, co2Saved: 5500, areas: 24 }, duration: '9 months', difficulty: 'Advanced' },
      { title: 'Energy Efficiency', category: 'energy', baseStats: { participants: 1550, co2Saved: 4900, areas: 21 }, duration: '5 months', difficulty: 'Intermediate' },
      { title: 'Sustainable Power', category: 'energy', baseStats: { participants: 1300, co2Saved: 4100, areas: 17 }, duration: '4 months', difficulty: 'Beginner' },

      // Water campaigns
      { title: 'Water Conservation', category: 'water', baseStats: { participants: 1200, areas: 18, co2Saved: 3200 }, duration: '4 months', difficulty: 'Beginner' },
      { title: 'Clean Water Project', category: 'water', baseStats: { participants: 1100, areas: 16, co2Saved: 2900 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Save Our Rivers', category: 'water', baseStats: { participants: 950, areas: 14, co2Saved: 2600 }, duration: '3 months', difficulty: 'Easy' },
      { title: 'Water Protection', category: 'water', baseStats: { participants: 1050, areas: 15, co2Saved: 2800 }, duration: '5 months', difficulty: 'Beginner' },
      { title: 'Aqua Conservation', category: 'water', baseStats: { participants: 1300, areas: 19, co2Saved: 3500 }, duration: '1 year', difficulty: 'Advanced' },
      { title: 'Pure Water Initiative', category: 'water', baseStats: { participants: 1150, areas: 17, co2Saved: 3100 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Water Guardians', category: 'water', baseStats: { participants: 1000, areas: 15, co2Saved: 2700 }, duration: '4 months', difficulty: 'Beginner' },
      { title: 'Hydro Protection', category: 'water', baseStats: { participants: 1250, areas: 18, co2Saved: 3400 }, duration: '8 months', difficulty: 'Intermediate' },

      // Waste campaigns
      { title: 'Plastic-Free Challenge', category: 'waste', baseStats: { participants: 1500, trashCollected: 4200, areas: 22 }, duration: '1 month', difficulty: 'Easy' },
      { title: 'Zero Waste Initiative', category: 'waste', baseStats: { participants: 1200, trashCollected: 3400, areas: 18 }, duration: '3 months', difficulty: 'Intermediate' },
      { title: 'Recycle Revolution', category: 'waste', baseStats: { participants: 1350, trashCollected: 3800, areas: 20 }, duration: '2 months', difficulty: 'Beginner' },
      { title: 'Waste Reduction', category: 'waste', baseStats: { participants: 1100, trashCollected: 3100, areas: 16 }, duration: '6 months', difficulty: 'Easy' },
      { title: 'Compost Community', category: 'waste', baseStats: { participants: 850, trashCollected: 2400, areas: 14 }, duration: '4 months', difficulty: 'Beginner' },
      { title: 'Trash to Treasure', category: 'waste', baseStats: { participants: 950, trashCollected: 2700, areas: 15 }, duration: '3 months', difficulty: 'Easy' },
      { title: 'Reduce Reuse Recycle', category: 'waste', baseStats: { participants: 1400, trashCollected: 3900, areas: 21 }, duration: '5 months', difficulty: 'Intermediate' },
      { title: 'Waste Warriors', category: 'waste', baseStats: { participants: 1250, trashCollected: 3500, areas: 19 }, duration: '4 months', difficulty: 'Beginner' },
      { title: 'Clean Living', category: 'waste', baseStats: { participants: 1000, trashCollected: 2800, areas: 16 }, duration: '2 months', difficulty: 'Easy' },
      { title: 'Minimal Waste', category: 'waste', baseStats: { participants: 1150, trashCollected: 3200, areas: 17 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Circular Economy', category: 'waste', baseStats: { participants: 1300, trashCollected: 3700, areas: 20 }, duration: '6 months', difficulty: 'Advanced' },
      { title: 'Waste-Free Future', category: 'waste', baseStats: { participants: 1450, trashCollected: 4100, areas: 23 }, duration: '1 year', difficulty: 'Intermediate' },

      // Wildlife campaigns
      { title: 'Wildlife Protection', category: 'wildlife', baseStats: { participants: 800, areas: 12, studentsImpacted: 8000 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Save the Bees', category: 'wildlife', baseStats: { participants: 650, areas: 10, studentsImpacted: 6500 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'Bird Conservation', category: 'wildlife', baseStats: { participants: 720, areas: 11, studentsImpacted: 7200 }, duration: '4 months', difficulty: 'Easy' },
      { title: 'Habitat Restoration', category: 'wildlife', baseStats: { participants: 900, areas: 14, studentsImpacted: 9000 }, duration: '9 months', difficulty: 'Advanced' },
      { title: 'Wildlife Rescue', category: 'wildlife', baseStats: { participants: 550, areas: 8, studentsImpacted: 5500 }, duration: '6 months', difficulty: 'Intermediate' },
      { title: 'Animal Guardians', category: 'wildlife', baseStats: { participants: 750, areas: 12, studentsImpacted: 7500 }, duration: '1 year', difficulty: 'Advanced' },
      { title: 'Species Protection', category: 'wildlife', baseStats: { participants: 680, areas: 10, studentsImpacted: 6800 }, duration: '8 months', difficulty: 'Intermediate' },
      { title: 'Wildlife Corridors', category: 'wildlife', baseStats: { participants: 820, areas: 13, studentsImpacted: 8200 }, duration: '10 months', difficulty: 'Advanced' },
      { title: 'Nature Preserve', category: 'wildlife', baseStats: { participants: 600, areas: 9, studentsImpacted: 6000 }, duration: '5 months', difficulty: 'Beginner' },
      { title: 'Biodiversity Project', category: 'wildlife', baseStats: { participants: 850, areas: 13, studentsImpacted: 8500 }, duration: '1 year', difficulty: 'Advanced' },
      { title: 'Wildlife Sanctuary', category: 'wildlife', baseStats: { participants: 750, areas: 11, studentsImpacted: 7500 }, duration: '7 months', difficulty: 'Intermediate' },
      { title: 'Eco Habitat', category: 'wildlife', baseStats: { participants: 700, areas: 11, studentsImpacted: 7000 }, duration: '6 months', difficulty: 'Beginner' },
      { title: 'Conservation Heroes', category: 'wildlife', baseStats: { participants: 950, areas: 15, studentsImpacted: 9500 }, duration: '1 year', difficulty: 'Advanced' },
      { title: 'Wild Life Support', category: 'wildlife', baseStats: { participants: 650, areas: 10, studentsImpacted: 6500 }, duration: '4 months', difficulty: 'Easy' },
      { title: 'Nature Protectors', category: 'wildlife', baseStats: { participants: 880, areas: 14, studentsImpacted: 8800 }, duration: '9 months', difficulty: 'Intermediate' }
    ];

    // Создаем счетчики для каждой категории
    const categoryCounters: Record<string, number> = {};
    
    this.campaigns = campaignData.map((data, index) => {
      const variationPercent = Math.random() * 10 + 5; // 5-15%
      
      // Получаем индекс для текущей категории
      if (!categoryCounters[data.category]) {
        categoryCounters[data.category] = 0;
      }
      const categoryIndex = categoryCounters[data.category];
      categoryCounters[data.category]++;
      
      const image = this.getUniqueImage(data.category, categoryIndex);
      
      // Рандомизируем статистику
      const stats = {
        participants: this.randomizeNumber(data.baseStats.participants, variationPercent),
        treesPlanted: data.baseStats.treesPlanted ? this.randomizeNumber(data.baseStats.treesPlanted, variationPercent) : undefined,
        trashCollected: data.baseStats.trashCollected ? this.randomizeNumber(data.baseStats.trashCollected, variationPercent) : undefined,
        milesWalked: data.baseStats.milesWalked ? this.randomizeNumber(data.baseStats.milesWalked, variationPercent) : undefined,
        studentsImpacted: data.baseStats.studentsImpacted ? this.randomizeNumber(data.baseStats.studentsImpacted, variationPercent) : undefined,
        schoolsReached: data.baseStats.schoolsReached ? this.randomizeNumber(data.baseStats.schoolsReached, variationPercent) : undefined,
        beachesClean: data.baseStats.beachesClean ? this.randomizeNumber(data.baseStats.beachesClean, variationPercent) : undefined,
        co2Saved: data.baseStats.co2Saved ? this.randomizeNumber(data.baseStats.co2Saved, variationPercent) : undefined,
        areas: data.baseStats.areas ? this.randomizeNumber(data.baseStats.areas, variationPercent) : undefined,
      };

      return {
        id: `campaign-${index + 1}`,
        title: data.title,
        description: this.getDescriptionByCategory(data.category),
        image,
        details: `${this.getDescriptionByCategory(data.category)} This campaign focuses on ${data.category.replace('-', ' ')} activities to create positive environmental impact in our community.`,
        steps: this.generateSteps(data.category),
        benefits: this.generateBenefits(data.category),
        stats,
        duration: data.duration,
        difficulty: data.difficulty as 'Easy' | 'Beginner' | 'Intermediate' | 'Advanced',
        location: this.getLocationByCategory(data.category),
        category: data.category as 'tree-planting' | 'cleanup' | 'education' | 'transport' | 'energy' | 'water' | 'waste' | 'wildlife'
      };
    });
  }

  private getDescriptionByCategory(category: string): string {
    const descriptions: Record<string, string[]> = {
      'tree-planting': [
        'Join us in planting trees to make our city greener and healthier.',
        'Help restore local forests and create sustainable green spaces.',
        'Plant trees in urban areas to improve air quality and beauty.',
        'Participate in reforestation efforts to combat climate change.',
        'Community-driven tree planting for a better tomorrow.'
      ],
      'cleanup': [
        'Help clean local waterways and restore natural beauty.',
        'Join our efforts to clean beaches and protect marine life.',
        'Community cleanup to make our neighborhoods beautiful.',
        'Remove litter and waste from public spaces.',
        'Restore natural areas through dedicated cleanup efforts.'
      ],
      'education': [
        'Educate children about environmental protection and sustainability.',
        'Spread awareness about climate change and green practices.',
        'Teaching programs for sustainable living and eco-consciousness.',
        'Environmental education for schools and communities.',
        'Building environmental awareness through interactive learning.'
      ],
      'transport': [
        'Promote sustainable transportation methods in your community.',
        'Encourage cycling and walking to reduce carbon emissions.',
        'Challenge yourself to use eco-friendly transport options.',
        'Reduce your carbon footprint through green transportation.',
        'Join the movement for sustainable and healthy commuting.'
      ],
      'energy': [
        'Promote renewable energy adoption in your community.',
        'Challenge yourself to reduce energy consumption.',
        'Learn about and implement energy-saving practices.',
        'Support clean energy initiatives and reduce power waste.',
        'Join the transition to sustainable energy sources.'
      ],
      'water': [
        'Protect and conserve our precious water resources.',
        'Ensure clean water access for all community members.',
        'Participate in water conservation and protection efforts.',
        'Help maintain clean and sustainable water systems.',
        'Join the fight to preserve our water sources.'
      ],
      'waste': [
        'Reduce waste and adopt sustainable consumption habits.',
        'Challenge yourself to minimize your environmental footprint.',
        'Promote recycling and waste reduction in your community.',
        'Learn and practice zero waste living principles.',
        'Transform waste management through community action.'
      ],
      'wildlife': [
        'Protect local wildlife and their natural habitats.',
        'Help preserve biodiversity through conservation efforts.',
        'Support wildlife rescue and rehabilitation programs.',
        'Create safe spaces for local wildlife to thrive.',
        'Join efforts to protect endangered species and ecosystems.'
      ]
    };

    const categoryDescriptions = descriptions[category] || descriptions['tree-planting'];
    return this.randomChoice(categoryDescriptions);
  }

  private getLocationByCategory(category: string): string {
    const locations: Record<string, string[]> = {
      'tree-planting': ['City Parks', 'Urban Areas', 'Local Forests', 'School Grounds'],
      'cleanup': ['Beaches', 'Rivers', 'Parks', 'Streets'],
      'education': ['Schools', 'Community Centers', 'Libraries', 'Online'],
      'transport': ['Citywide', 'Urban Areas', 'Downtown', 'Neighborhoods'],
      'energy': ['Residential', 'Commercial', 'Schools', 'Community'],
      'water': ['Watersheds', 'Rivers', 'Lakes', 'Community'],
      'waste': ['Household', 'Community', 'Schools', 'Workplaces'],
      'wildlife': ['Nature Reserves', 'Wildlife Parks', 'Forests', 'Wetlands']
    };

    const categoryLocations = locations[category] || locations['tree-planting'];
    return this.randomChoice(categoryLocations);
  }

  private generateSteps(category: string): string[] {
    const stepTemplates: Record<string, string[]> = {
      'tree-planting': [
        'Register for the event online',
        'Choose your preferred planting location',
        'Attend orientation session',
        'Plant trees with provided tools',
        'Help with ongoing maintenance'
      ],
      'cleanup': [
        'Check cleanup schedule',
        'Bring reusable water bottle',
        'Meet at designated area',
        'Collect trash and recyclables',
        'Sort materials for disposal'
      ],
      'education': [
        'Apply as volunteer educator',
        'Complete training modules',
        'Get assigned to schools',
        'Prepare interactive lessons',
        'Conduct educational sessions'
      ],
      'transport': [
        'Download tracking app',
        'Log daily transport choices',
        'Share eco-friendly trips',
        'Join group events',
        'Encourage friends to participate'
      ],
      'energy': [
        'Assess current energy usage',
        'Implement energy-saving measures',
        'Track your progress',
        'Share tips with community',
        'Celebrate achievements'
      ],
      'water': [
        'Learn about water conservation',
        'Install water-saving devices',
        'Monitor water usage',
        'Educate others about conservation',
        'Participate in local initiatives'
      ],
      'waste': [
        'Assess current waste production',
        'Implement reduction strategies',
        'Start composting program',
        'Share experience with others',
        'Track waste reduction progress'
      ],
      'wildlife': [
        'Learn about local wildlife',
        'Participate in habitat restoration',
        'Support wildlife protection',
        'Educate community about conservation',
        'Monitor and report wildlife activity'
      ]
    };

    return stepTemplates[category] || stepTemplates['tree-planting'];
  }

  private generateBenefits(category: string): string[] {
    const benefitTemplates: Record<string, string[]> = {
      'tree-planting': [
        'Improve air quality',
        'Create green spaces',
        'Learn about sustainability',
        'Meet eco enthusiasts',
        'Earn community service hours'
      ],
      'cleanup': [
        'Protect wildlife',
        'Keep areas beautiful',
        'Reduce pollution',
        'Enjoy outdoor exercise',
        'Connect with nature'
      ],
      'education': [
        'Educate next generation',
        'Develop teaching skills',
        'Make lasting impact',
        'Build professional network',
        'Gain volunteer experience'
      ],
      'transport': [
        'Reduce carbon footprint',
        'Improve personal fitness',
        'Save money on fuel',
        'Discover new routes',
        'Win prizes'
      ],
      'energy': [
        'Reduce energy bills',
        'Lower carbon footprint',
        'Learn about renewables',
        'Inspire others',
        'Contribute to sustainability'
      ],
      'water': [
        'Conserve precious resource',
        'Reduce water bills',
        'Protect ecosystems',
        'Learn conservation techniques',
        'Support community health'
      ],
      'waste': [
        'Reduce environmental impact',
        'Save money',
        'Develop sustainable habits',
        'Inspire others',
        'Support circular economy'
      ],
      'wildlife': [
        'Protect biodiversity',
        'Support ecosystem health',
        'Learn about nature',
        'Connect with wildlife',
        'Preserve natural heritage'
      ]
    };

    return benefitTemplates[category] || benefitTemplates['tree-planting'];
  }

  // Получить все кампании
  getAllCampaigns(): Campaign[] {
    return this.campaigns;
  }

  // Получить случайные кампании для главного экрана
  getRandomCampaigns(count: number): Campaign[] {
    const shuffled = [...this.campaigns].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Получить кампании по посадке деревьев
  getTreePlantingCampaigns(): Campaign[] {
    return this.campaigns.filter(c => c.category === 'tree-planting');
  }

  // Получить кампании, исключающие определенные ID
  getCampaignsExcluding(excludeIds: string[]): Campaign[] {
    return this.campaigns.filter(c => !excludeIds.includes(c.id));
  }

  // Получить кампанию по ID
  getCampaignById(id: string): Campaign | undefined {
    return this.campaigns.find(c => c.id === id);
  }

  // Получить случайные кампании определенной категории
  getRandomCampaignsByCategory(category: string, count: number): Campaign[] {
    const categoryCampaigns = this.campaigns.filter(c => c.category === category);
    const shuffled = [...categoryCampaigns].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Рерандомизация статистик всех кампаний
  rerandomizeStats(): void {
    this.campaigns.forEach(campaign => {
      // Берем базовые статистики из первоначальных данных по категории
      const baseData = this.getCampaignTemplateData().find(
        data => data.category === campaign.category
      );
      
      if (baseData) {
        // Применяем рандомизацию к базовым значениям
        campaign.stats = {
          participants: this.randomizeNumber(baseData.baseStats.participants, 15),
          ...(baseData.baseStats.treesPlanted && { 
            treesPlanted: this.randomizeNumber(baseData.baseStats.treesPlanted, 10) 
          }),
          ...(baseData.baseStats.trashCollected && { 
            trashCollected: this.randomizeNumber(baseData.baseStats.trashCollected, 12) 
          }),
          ...(baseData.baseStats.milesWalked && { 
            milesWalked: this.randomizeNumber(baseData.baseStats.milesWalked, 8) 
          }),
          ...(baseData.baseStats.studentsImpacted && { 
            studentsImpacted: this.randomizeNumber(baseData.baseStats.studentsImpacted, 15) 
          }),
          ...(baseData.baseStats.schoolsReached && { 
            schoolsReached: this.randomizeNumber(baseData.baseStats.schoolsReached, 20) 
          }),
          ...(baseData.baseStats.beachesClean && { 
            beachesClean: this.randomizeNumber(baseData.baseStats.beachesClean, 25) 
          }),
          ...(baseData.baseStats.co2Saved && { 
            co2Saved: this.randomizeNumber(baseData.baseStats.co2Saved, 10) 
          }),
          ...(baseData.baseStats.areas && { 
            areas: this.randomizeNumber(baseData.baseStats.areas, 12) 
          })
        };
      }
    });
  }

  // Получение шаблонных данных для рерандомизации
  private getCampaignTemplateData() {
    return [
      // Tree planting campaigns
      { title: 'Tree Planting Program', category: 'tree-planting', baseStats: { participants: 1500, treesPlanted: 2000, co2Saved: 4500 }, duration: '6 months', difficulty: 'Beginner' },
      { title: 'Urban Forest Project', category: 'tree-planting', baseStats: { participants: 1200, treesPlanted: 1800, co2Saved: 4000 }, duration: '1 year', difficulty: 'Intermediate' },
      { title: 'Green City Initiative', category: 'tree-planting', baseStats: { participants: 1800, treesPlanted: 2500, co2Saved: 5500 }, duration: '8 months', difficulty: 'Advanced' },
      { title: 'Forest Recovery', category: 'tree-planting', baseStats: { participants: 1000, treesPlanted: 1500, co2Saved: 3500 }, duration: '4 months', difficulty: 'Easy' },
      { title: 'Community Plantation', category: 'tree-planting', baseStats: { participants: 1350, treesPlanted: 1900, co2Saved: 4200 }, duration: '5 months', difficulty: 'Beginner' },
      
      // Cleanup campaigns  
      { title: 'Beach Cleanup', category: 'cleanup', baseStats: { participants: 800, trashCollected: 1200, beachesClean: 15 }, duration: '2 months', difficulty: 'Easy' },
      { title: 'City Clean Drive', category: 'cleanup', baseStats: { participants: 1100, trashCollected: 1800, areas: 25 }, duration: '3 months', difficulty: 'Beginner' },
      { title: 'River Restoration', category: 'cleanup', baseStats: { participants: 950, trashCollected: 1500, areas: 20 }, duration: '4 months', difficulty: 'Intermediate' },
      
      // Education campaigns
      { title: 'Eco Education', category: 'education', baseStats: { participants: 600, studentsImpacted: 1500, schoolsReached: 12 }, duration: '6 months', difficulty: 'Easy' },
      { title: 'Green Learning', category: 'education', baseStats: { participants: 750, studentsImpacted: 1800, schoolsReached: 15 }, duration: '1 year', difficulty: 'Beginner' },
      
      // Transport campaigns
      { title: 'Bike to Work', category: 'transport', baseStats: { participants: 500, milesWalked: 2500, co2Saved: 1800 }, duration: '3 months', difficulty: 'Easy' },
      { title: 'Car-Free Days', category: 'transport', baseStats: { participants: 800, milesWalked: 3500, co2Saved: 2500 }, duration: '6 months', difficulty: 'Beginner' },
      
      // Energy campaigns
      { title: 'Solar Power Push', category: 'energy', baseStats: { participants: 400, areas: 8, co2Saved: 3000 }, duration: '1 year', difficulty: 'Advanced' },
      { title: 'Energy Savers', category: 'energy', baseStats: { participants: 650, areas: 12, co2Saved: 2200 }, duration: '4 months', difficulty: 'Intermediate' },
      
      // Water campaigns
      { title: 'Water Conservation', category: 'water', baseStats: { participants: 1200, areas: 18, co2Saved: 3200 }, duration: '4 months', difficulty: 'Beginner' },
      { title: 'Clean Water Project', category: 'water', baseStats: { participants: 1100, areas: 16, co2Saved: 2900 }, duration: '6 months', difficulty: 'Intermediate' },
      
      // Waste campaigns
      { title: 'Zero Waste Challenge', category: 'waste', baseStats: { participants: 900, trashCollected: 1400, areas: 22 }, duration: '3 months', difficulty: 'Intermediate' },
      { title: 'Plastic Free Life', category: 'waste', baseStats: { participants: 1050, trashCollected: 1600, areas: 28 }, duration: '6 months', difficulty: 'Advanced' },
      
      // Wildlife campaigns
      { title: 'Wildlife Protection', category: 'wildlife', baseStats: { participants: 700, areas: 15, co2Saved: 2800 }, duration: '1 year', difficulty: 'Advanced' },
      { title: 'Bird Conservation', category: 'wildlife', baseStats: { participants: 550, areas: 12, co2Saved: 2200 }, duration: '8 months', difficulty: 'Intermediate' }
    ];
  }
}

export default new CampaignService(); 
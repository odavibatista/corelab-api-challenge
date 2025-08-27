import { PrismaClient } from '@prisma/client';
import { EncrypterProvider } from '../../../providers/Encrypter.provider';

export const noteSeeder = async (prisma: PrismaClient) => {
  console.log('Running Notes seeder...');

  const encrypterProvider = new EncrypterProvider();

  const userEmail = 'usuario_corenotes@gmail.com';
  const enc = encrypterProvider.encrypt({ content: userEmail });

  const existingUser = await prisma.user.findFirst({
    where: {
      email: enc,
    },
  });

  if (!existingUser) {
    console.log('No user found, skipping notes seeder.');
    return;
  }

  await prisma.note.createMany({
    data: [
      {
        note_title: encrypterProvider.encrypt({ content: 'Nota 1' }),
        note_text: encrypterProvider.encrypt({ content: 'Texto da Nota 1' }),
        user_id: existingUser.id_user,
        starred: false,
        note_color: 'red',
      },
      {
        note_title: encrypterProvider.encrypt({ content: 'Nota 2' }),
        note_text: encrypterProvider.encrypt({ content: 'Texto da Nota 2' }),
        user_id: existingUser.id_user,
        starred: true,
        note_color: 'yellow',
      },
      {
        note_title: encrypterProvider.encrypt({ content: 'Nota 3' }),
        note_text: encrypterProvider.encrypt({ content: 'Texto da Nota 3' }),
        user_id: existingUser.id_user,
        starred: false,
        note_color: 'green',
      },
    ],
  });

  console.log('Notes seeder completed.');
};

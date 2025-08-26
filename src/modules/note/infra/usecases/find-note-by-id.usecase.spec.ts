import { EncrypterProvider } from '../../../../shared/infra/providers/Encrypter.provider';
import { NoteNotFoundException } from '../../domain/dtos/errors/NoteNotFoundException.exception';
import { FindNoteByIdResponseDto } from '../../domain/dtos/requests/FindNote.request.dto';
import { NoteRepository } from '../db/repositories/note.repository';
import { FindNoteByIdUsecase } from './find-note-by-id.usecase';
import { faker } from '@faker-js/faker';

describe('Find Gym By Id Use Case', () => {
  let usecase: FindNoteByIdUsecase;
  let mockRepository: NoteRepository;
  let encrypterProvider: EncrypterProvider;

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick'] });
  });

  beforeEach(async () => {
    encrypterProvider = new EncrypterProvider();
    mockRepository = new NoteRepository(encrypterProvider);
    usecase = new FindNoteByIdUsecase(encrypterProvider, mockRepository);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should throw an exception when given an invalid note id', async () => {
    const invalidId = 'invalid-id';
    jest.spyOn(mockRepository, 'findById').mockResolvedValueOnce(null);

    await expect(usecase.execute(invalidId)).rejects.toThrow(
      NoteNotFoundException,
    );
  });

  it('should return a note when a valid id is provided', async () => {
    const mockNote = {
      id_note: 'valid-id',
      note_title: faker.company.name(),
      note_color: faker.lorem.paragraph(),
      user_id: 'valid-user-id',
      note_text: faker.lorem.paragraphs(2),
      starred: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(mockRepository, 'findById').mockResolvedValueOnce(mockNote);
    jest
      .spyOn(encrypterProvider, 'decrypt')
      .mockReturnValueOnce(mockNote.note_title);
    jest
      .spyOn(encrypterProvider, 'decrypt')
      .mockReturnValueOnce(mockNote.note_text);

    const result = await usecase.execute(mockNote.id_note);

    expect(result).toEqual(mockNote);
  });
});

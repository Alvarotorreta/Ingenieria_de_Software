import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mision_emprende_backend.settings')
django.setup()

from challenges.models import Activity, AnagramWord

act = Activity.objects.filter(id=2).first()
print(f'Activity: {act.name if act else None}')

if act:
    anagram_data = act.get_anagram_data(count=5, team_id=1, session_stage_id=1)
    if anagram_data and 'words' in anagram_data:
        print(f'Anagram data words count: {len(anagram_data["words"])}')
        print(f'Words: {[w["word"] for w in anagram_data["words"]]}')
    else:
        print('No anagram data returned')

print(f'Total anagram words in DB: {AnagramWord.objects.filter(is_active=True).count()}')




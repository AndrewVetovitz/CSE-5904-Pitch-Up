import json

from watson.tone_analyzer import ToneAnalyzer 

company_keywords = {}
company_keywords['Amazon'] = ['leaders', 'customer', 'standards', 'hire', 'invention', 'customers', 'ways', 'trust', 'decisions', 'quality'] 
company_keywords['Microsoft'] = ['computing', 'laptop', 'sustainability', 'labs', 'technologies', 'inclusion', 'trustworthy', 'environment', 'computer', 'employee']
company_keywords['Facebook'] = ['everyone', 'risks', 'things', 'facebook', 'impact', 'decisions', 'focus', 'companies', 'mistakes', 'problems']
company_keywords['Google'] = ['web', 'google', 'search', 'ads', 'email', 'content', 'advertising', 'android', 'pages', 'users']

class Analysis(object):
    def words_per_minute(self, transcript, duration):
        if duration == 0:
            return 0
        else:
            trans_list = transcript.split()
            
            words_per_minute = float(len(trans_list) * 60) / float(duration)
            return round(words_per_minute, 2)

    def num_occurences(self, transcript, find_word_list):
        trans_list = transcript.split()
        count = 0
        
        for word in trans_list:
            if word in find_word_list:
                count += 1

        return count

    def num_char_per_word(self, transcript, char_to_find):
        trans_list = transcript.split()
        count = 0
        
        for word in trans_list:
            if char_to_find in word:
                count += 1

        return count

    def discovery_analysis(self, transcript, pitch):
        analysis_concepts = ''
        trans_list = transcript.split()
        concept_analysis = {}

        if pitch.related_concepts:
            concepts = (" ".join(json.loads(pitch.related_concepts)).lower()).split()
            for word in trans_list:
                if word in concepts:
                    concept_analysis[word] = concept_analysis.get(word, 0) + 1
            
            analysis_concepts = json.dumps(concept_analysis)

        return analysis_concepts

    def tone_anaysis(self, transcript):
        ta = ToneAnalyzer()

        return ta.analyzeTone(transcript)

    def contains_name(self, transcript, name):
        if name in transcript:
            return True
        else:
            for _name in name.split(" "):
                if _name in transcript:
                    return True

        return False

    def company_similarity(self, transcript, company):
        if company == '':
            return 0
        
        keywords = company_keywords[company]
        score = 0

        for word in transcript.split(' '):
            for keyword in keywords:
                if keyword == word:
                    score += 1

        return score

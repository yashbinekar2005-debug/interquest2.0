import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from mouth import speak

# load your Q&A dataset from text file
def load_qa_data(file_path):
    with open(file_path,'r',encoding='utf-8')as file:
        lines=file.readlines()
        qna_pairs=[line.strip().split(':')for line in lines if ':' in line]
        # dataset=[{'queation':q,'answer':a} for q,a in qna_pairs]
        dataset=[{'question':q.strip(),'answer':a.strip()} for q,a in qna_pairs]
    return dataset
#preprocess the text

# 
def preproces_text(text):
    stop_words = set(stopwords.words('english'))
    ps = PorterStemmer()
    tokens = word_tokenize(text.lower())
    tokens = [ps.stem(tok) for tok in tokens if tok.isalnum() and tok not in stop_words]
    return ' '.join(tokens)

# train the tf-idf vectorizer
def train_tfidf_vectorizer(dataset):
    corpus=[preproces_text(qa['question'])for qa in dataset]
    vectorizer=TfidfVectorizer()
    X=vectorizer.fit_transform(corpus)
    return vectorizer,X

# retraive the most relevant answer
def getanswer(question,vectorizer,X,dataset):
    question=preproces_text(question)
    question_vec=vectorizer.transform([question])
    similarity =cosine_similarity(question_vec,X)
    best_match_index=similarity.argmax()
    return dataset[best_match_index]['answer']

# main function
def main():
    # reapalce your dataset with actual path
    dataset_path=r'C:\Users\YASH BINEKAR\OneDrive\Desktop\Vasu4.0\Data\brain_data\data.txt'
    dataset=load_qa_data(dataset_path)
    vectorizer,X=train_tfidf_vectorizer(dataset)
    # user_question=text
    # answer=getanswer(user_question,vectorizer,X,dataset)
    # speak(answer)
    print("🤖 VASU 4.0 is ready! Type something (or 'exit' to quit)\n")

    while True:
        user_question = input("You: ").strip()
        if user_question.lower() in ["exit", "quit", "stop"]:
            print("🧠 VASU: Goodbye!")
            speak("Goodbye!")
            break

        answer = getanswer(user_question, vectorizer, X, dataset)
        # print("🧠 VASU:", answer)
        speak(answer)
if __name__ == "__main__":
    main()

